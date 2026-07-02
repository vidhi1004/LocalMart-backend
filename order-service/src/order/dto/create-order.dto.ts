import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-orderItem.dto';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
  @IsNotEmpty()
  shippingAddress: string;
  @IsNotEmpty()
  shippingCity: string;
  @IsNotEmpty()
  shippingState: string;
  @IsNotEmpty()
  shippingPincode: string;
  @IsNotEmpty()
  shippingPhone: string;
}
