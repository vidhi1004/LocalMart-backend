import { IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  recipients: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsString()
  text?: string;
}
