import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  CreateReviewDto,
  DeleteReviewDto,
  Empty,
  GetReviewByIdDto,
  GetReviewsByProductIdDto,
  REVIEW_SERVICE_NAME,
  UpdateReviewDto,
} from './review';

@Injectable()
export class ReviewService implements OnModuleInit {
  private reviewService!: ReviewService;
  constructor(
    @Inject('REVIEW_PACKAGE')
    private readonly reviewServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.reviewService =
      this.reviewServiceClient.getService<ReviewService>(REVIEW_SERVICE_NAME);
  }
  createReview(request: CreateReviewDto) {
    return this.reviewService.createReview(request);
  }

  getAllReviews(request: Empty) {
    return this.reviewService.getAllReviews(request);
  }

  getReviewById(request: GetReviewByIdDto) {
    return this.reviewService.getReviewById(request);
  }

  getReviewsByProductId(request: GetReviewsByProductIdDto) {
    return this.reviewService.getReviewsByProductId(request);
  }
  updateReview(request: UpdateReviewDto) {
    return this.reviewService.updateReview(request);
  }

  deleteReview(request: DeleteReviewDto) {
    return this.reviewService.deleteReview(request);
  }
}
