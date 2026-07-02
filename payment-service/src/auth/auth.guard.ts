import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // <-- 1. Import ConfigService
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  // 2. Inject ConfigService into the constructor
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    try {
      // 3. Always pull the secret using configService safely
      const secret = this.configService.get('JWT_SECRET');
      const user = jwt.verify(token, secret);

      request.token = token;
      request.user = user;
      return true;
    } catch (error) {
      // This will capture and return the precise reason if verification fails
      throw new UnauthorizedException(`Token Verification Failed: ${error}`);
    }
  }
}
