import { IsNotEmpty, Max, Min } from 'class-validator';
export class CreateReviewDto {
  @IsNotEmpty()
  productId: number;
  orderId: number;
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
  @IsNotEmpty()
  comment: string;
}
