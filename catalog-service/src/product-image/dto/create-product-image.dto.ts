import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateProductImageDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
  @IsBoolean()
  isPrimary: boolean;
  @IsNumber()
  displayOrder: number;
}
