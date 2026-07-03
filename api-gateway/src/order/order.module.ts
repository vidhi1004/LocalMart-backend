import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.ORDER_SERVICE_URL ?? 'localhost:50053',
          package: 'order',
          protoPath: join(process.cwd(), '/proto/order.proto'),
          credentials: grpc.credentials.createInsecure(),
        },
      },
    ]),
  ],

  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
