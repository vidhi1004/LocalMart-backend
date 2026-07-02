import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'index';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductImageModule } from './product-image/product-image.module';

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
    CategoryModule,
    ProductModule,
    ProductVariantModule,
    InventoryModule,
    ProductImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
