import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as http from 'http';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: 'notification_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();
}
const healthPort = process.env.HEALTH_PORT || 3005;

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
