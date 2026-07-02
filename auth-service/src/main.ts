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
}
bootstrap();
