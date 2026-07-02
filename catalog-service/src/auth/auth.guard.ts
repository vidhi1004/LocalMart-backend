import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }
    request.user = user;
    return true;
  }
}
