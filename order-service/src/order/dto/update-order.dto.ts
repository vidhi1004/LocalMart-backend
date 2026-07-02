import { Status } from '../../enum/status.enum';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(Status)
  status: Status;
}
