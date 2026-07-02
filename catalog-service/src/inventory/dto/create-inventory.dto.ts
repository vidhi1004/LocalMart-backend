import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  productVariantId: number;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
