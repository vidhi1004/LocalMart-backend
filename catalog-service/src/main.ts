import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(process.cwd(), '/proto/catalog.proto'),
        package: 'catalog',
        url: `0.0.0.0:${process.env.PORT ?? 50052}`,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  console.log(process.env.PORT ?? 50052)
  await app.listen();
}
bootstrap();
