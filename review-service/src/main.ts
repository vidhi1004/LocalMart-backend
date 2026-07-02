import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as http from 'http';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(process.cwd(), '/proto/review.proto'),
        package: 'review',
        url: `0.0.0.0:${process.env.PORT ?? 50055}`,
      },
    },
  );

  await app.listen();
  console.log(process.env.PORT ?? 50055);
}
const healthPort = process.env.HEALTH_PORT || 3002;

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
