import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ReviewService } from './review/review.service';
import {
  DeleteReviewDto,
  CreateReviewDto,
  UpdateReviewDto,
  GetReviewByIdDto,
  GetReviewsByProductIdDto,
  ReviewServiceController,
  ReviewServiceControllerMethods,
} from './review';

@Controller()
@ReviewServiceControllerMethods()
export class AppController implements ReviewServiceController {
  constructor(private readonly reviewService: ReviewService) {}

  async createReview(request: CreateReviewDto) {
    console.log('Controller reached');
    return this.reviewService.create(request, request.userId);
  }

  async getAllReviews() {
    return this.reviewService.findAll();
  }

  async getReviewById(request: GetReviewByIdDto) {
    return this.reviewService.findOne(request.id);
  }

  async getReviewsByProductId(request: GetReviewsByProductIdDto) {
    return this.reviewService.findByProductId(request.productId);
  }

  async updateReview(request: UpdateReviewDto) {
    return this.reviewService.update(request.id, request, request.userId);
  }

  async deleteReview(request: DeleteReviewDto) {
    return this.reviewService.remove(request.id, request.userId);
  }
}
