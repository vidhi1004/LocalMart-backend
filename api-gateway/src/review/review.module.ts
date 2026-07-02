import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'REVIEW_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.REVIEW_SERVICE_URL ?? 'localhost:50055',
          package: 'review',
          protoPath: join(process.cwd(), '/proto/review.proto'),
          credentials:
            process.env.NODE_ENV === 'production'
              ? grpc.credentials.createSsl()
              : grpc.credentials.createInsecure(),
        },
      },
    ]),
  ],

  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
