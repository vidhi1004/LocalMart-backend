import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as http from 'http';

async function bootstrap() {
  // 1. Keep your working gRPC Microservice configuration exactly as it is:
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(process.cwd(), '/proto/auth.proto'),
        package: 'auth',
        url: `0.0.0.0:${process.env.PORT ?? 50051}`,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log(
    `Auth Microservice is securely running on port ${process.env.PORT ?? 50051}`,
  );

  
  const healthPort = process.env.HEALTH_PORT || 3002; 

  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Healthy');
  }).listen(Number(healthPort), '0.0.0.0', () => {
    console.log(`Render dummy HTTP health check listening safely on port ${healthPort}`);
  });
}
bootstrap();