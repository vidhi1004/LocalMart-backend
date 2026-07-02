import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
