import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CATALOG_SERVICE_NAME, CatalogServiceClient } from 'src/catalog';
import { ORDER_SERVICE_NAME, OrderServiceClient, Status } from 'src/order';

export class ReviewService implements OnModuleInit {
  private catalogService!: CatalogServiceClient;
  private orderService!: OrderServiceClient;

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @Inject('CATALOG_PACKAGE')
    private readonly catalogClient: ClientGrpc,

    @Inject('ORDER_PACKAGE')
    private readonly orderClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.catalogService =
      this.catalogClient.getService<CatalogServiceClient>(CATALOG_SERVICE_NAME);

    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  async productExists(productId: number) {
    try {
      return await firstValueFrom(
        this.catalogService.getProductById({
          id: productId,
        }),
      );
    } catch (e) {
      console.error('Catalog gRPC Error:', e);
      throw e;
    }
  }
  async orderExists(orderId: number, userId: number) {
    try {
      return await firstValueFrom(
        this.orderService.getOrderById({
          id: orderId,
          userId,
        }),
      );
    } catch (e) {
      console.error('Catalog gRPC Error:', e);
      throw e;
    }
  }
  async create(createReviewDto: CreateReviewDto, userId: number) {
    try {
      console.log(createReviewDto);

      const product = await this.productExists(createReviewDto.productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const order = await this.orderExists(createReviewDto.orderId, userId);
      if (!order || order.userId !== userId) {
        throw new ForbiddenException('You are not the owner of this order');
      }
      if (order.status !== Status.DELIVERED) {
        throw new ForbiddenException('You can only review delivered orders');
      }
      const reviewExists = await this.reviewRepository.findOne({
        where: { productId: createReviewDto.productId, userId: userId },
      });
      if (reviewExists) {
        throw new ForbiddenException('You have already reviewed this product');
      }
      const review = this.reviewRepository.create({
        ...createReviewDto,
        userId: userId,
      });
      return this.reviewRepository.save(review);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findAll() {
    const reviews = await this.reviewRepository.find({
      where: { isActive: true },
    });
    if (!reviews) {
      return { reviews: [] };
    }
    return { reviews: reviews };
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: id, isActive: true },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }
  async findByProductId(productId: number) {
    const reviews = await this.reviewRepository.find({
      where: { productId: productId, isActive: true },
    });
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException('No reviews found for this product');
    }
    return { reviews };
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this review');
    }
    const updatedReview = Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(updatedReview);
  }

  async remove(id: number, userId: number) {
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this review');
    }
    return this.reviewRepository.remove(review);
  }
}
