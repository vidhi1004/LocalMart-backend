import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as http from 'http';

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
  console.log(process.env.PORT ?? 50052);
  await app.listen();
}

const healthPort = process.env.HEALTH_PORT || 3003;

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Healthy');
  })
  .listen(Number(healthPort), '0.0.0.0', () => {
    console.log(
      `Render dummy HTTP health check listening safely on port ${healthPort}`,
    );
  });
bootstrap();
