import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT, ORDER_CLIENT } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entities } from './entity';
import { join } from 'path';
import { PaymentGrpcController } from './app.grpc.controller';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(process.cwd(), '/proto/order.proto'),
          url: process.env.ORDER_SERVICE_URL ?? 'order-service:50053',
        },
      },
    ]),
    TypeOrmModule.forFeature([Payment]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        host: !configService.get('DATABASE_URL')
          ? configService.get('DB_HOST')
          : undefined,
        port: !configService.get('DATABASE_URL')
          ? configService.get<number>('DB_PORT')
          : undefined,
        username: !configService.get('DATABASE_URL')
          ? configService.get('DB_USERNAME')
          : undefined,
        password: !configService.get('DATABASE_URL')
          ? configService.get('DB_PASSWORD')
          : undefined,
        database: !configService.get('DATABASE_URL')
          ? configService.get('DB_NAME')
          : undefined,

        entities: entities,
        synchronize: true,

        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),

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
        name: ORDER_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: 'order_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),

    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [AppController, PaymentGrpcController],
  providers: [AppService],
})
export class AppModule {}
