import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INVENTORY_CLIENT, NOTIFICATION_CLIENT } from 'src/constants';
import { join } from 'path';
import * as grpc from '@grpc/grpc-js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ClientsModule.register([
      {
        name: 'CATALOG_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.CATALOG_SERVICE_URL ?? 'localhost:50052',
          package: 'catalog',
          protoPath: join(process.cwd(), '/proto/catalog.proto'),
          credentials: grpc.credentials.createInsecure(),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: NOTIFICATION_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: INVENTORY_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: 'inventory_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
