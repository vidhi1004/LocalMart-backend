import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto,@Req() req) {
    return this.reviewService.create(createReviewDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }
  @Get('product/:productId')
  findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id' , ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto,@Req() req) {
    return this.reviewService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number,@Req() req) {
    return this.reviewService.remove(id, req.user.id);
  }
}
