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
        protoPath: join(process.cwd(), '/proto/payment.proto'),
        package: 'payment',
        url: `0.0.0.0:${process.env.PORT ?? 50054}`,
      },
    },
  );

  await app.listen();
  console.log(process.env.PORT ?? 50054);
}
bootstrap();
