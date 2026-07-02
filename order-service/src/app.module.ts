import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './order/entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT } from './constants';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
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
        synchronize: configService.get('NODE_ENV') !== 'production',

        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
