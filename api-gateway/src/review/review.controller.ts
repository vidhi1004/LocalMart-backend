import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/guard/auth.guard';
import type { CreateReviewDto, UpdateReviewDto } from './review';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Post()
  createReview(@Body() dto: CreateReviewDto, @Req() req) {
    console.log('API gateway Controller reached', dto);
    return this.reviewService.createReview({
      ...dto,
      userId: Number(req.user.id),
    });
  }

  @Get()
  getAllReviews() {
    return this.reviewService.getAllReviews({});
  }

  @Get(':id')
  getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReviewById({ id });
  }

  @Get('product/:productId')
  getReviewsByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getReviewsByProductId({
      productId,
    });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
    @Req() req,
  ) {
    return this.reviewService.updateReview({
      ...dto,
      id,
      userId: Number(req.user.id),
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteReview(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.reviewService.deleteReview({
      id,
      userId: Number(req.user.id),
    });
  }
}
