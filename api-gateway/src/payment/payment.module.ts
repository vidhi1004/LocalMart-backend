import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'PAYMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.PAYMENT_SERVICE_URL ?? 'localhost:50054',
          package: 'payment',
          protoPath: join(process.cwd(), '/proto/payment.proto'),
          credentials: grpc.credentials.createInsecure(),
        },
      },
    ]),
  ],

  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
