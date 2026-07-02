import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path/win32';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'CATALOG_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.CATALOG_SERVICE_URL ?? 'localhost:50052',
          package: 'catalog',
          protoPath: join(process.cwd(), '/proto/catalog.proto'),
        },
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
