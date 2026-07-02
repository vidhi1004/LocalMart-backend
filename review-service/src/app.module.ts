import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './review/entities';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
