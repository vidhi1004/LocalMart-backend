import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
}
bootstrap();
