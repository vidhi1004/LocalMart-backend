import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = jwt.decode(token, this.configService.get('JWT_SECRET'));
    const requiredRole = this.reflector.get('role', context.getHandler());
    if (user.role === requiredRole) {
      return true;
    }
    return false;
  }
}
