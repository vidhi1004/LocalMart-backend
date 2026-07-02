import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path/win32';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE_URL ?? 'localhost:50051',
          package: 'auth',
          protoPath: join(process.cwd(), '/proto/auth.proto'),
          credentials:
            process.env.NODE_ENV === 'production'
              ? grpc.credentials.createSsl()
              : grpc.credentials.createInsecure(),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
