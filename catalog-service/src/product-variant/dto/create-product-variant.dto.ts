import { Size } from '../enum/size.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @IsString()
  @IsNotEmpty()
  sku: string;
  @IsEnum(Size)
  @IsNotEmpty()
  size: Size;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  color: string;
}
