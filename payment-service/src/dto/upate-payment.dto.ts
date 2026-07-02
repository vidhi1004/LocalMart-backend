// import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { PaymentMode } from 'src/enum/paymentMode.enum';
// import { PaymentStatus } from 'src/enum/paymentStatus.enum';

// export class UpdatePaymentDto {
//   @IsEnum(PaymentStatus)
//   paymentstatus: PaymentStatus;

//   @IsString()
//   @IsOptional()
//   transactionId: string;

//   @IsEnum(PaymentMode)
//   paymentMode: PaymentMode;

//   @IsNotEmpty()
//   razorpayPaymentId: string;
//   razorpaySignature?: string;
// }

import { PaymentMode } from '../enum/paymentMode.enum';
import { PaymentStatus } from '../enum/paymentStatus.enum';

export class UpdatePaymentDto {
  paymentstatus: PaymentStatus;
  paymentMode: PaymentMode;
  transactionId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
