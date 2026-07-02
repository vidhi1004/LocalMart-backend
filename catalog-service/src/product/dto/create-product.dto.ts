import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  brand: string;
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
