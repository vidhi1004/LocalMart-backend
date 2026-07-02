import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @IsNotEmpty()
  @IsNumber()
  productVariantId: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
