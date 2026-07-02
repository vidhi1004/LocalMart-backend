import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

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
        },
      },
    ]),
  ],

  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
