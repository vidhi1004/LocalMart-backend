import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsNumber()
  @IsOptional()
  reservedStock: number;
}
