import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Empty,
  CreatePaymentDto,
  UpdatePaymentDto,
  GetPaymentByIdDto,
  PaymentServiceController,
  PaymentServiceControllerMethods,
} from './payment';
import { PaymentStatus } from './enum/paymentStatus.enum';
import { PaymentMode } from './enum/paymentMode.enum';

@Controller()
@PaymentServiceControllerMethods()
export class PaymentGrpcController implements PaymentServiceController {
  constructor(private readonly appService: AppService) {}

  async createPayment(request: CreatePaymentDto) {
    return this.appService.create(request, request.userId);
  }

  async getAllPayments(request: Empty) {
    return this.appService.findAll();
  }

  async getPaymentById(request: GetPaymentByIdDto) {
    return this.appService.findOne(request.id, request.userId);
  }

  async updatePayment(request: UpdatePaymentDto) {
    console.log('FULL REQUEST');
    console.log(JSON.stringify(request, null, 2));

    console.log('paymentMode:', request.paymentMode);
    console.log('paymentstatus:', request.paymentstatus);

    const dto = {
      paymentstatus: request.paymentstatus as PaymentStatus,
      paymentMode: request.paymentMode as PaymentMode,
      transactionId: request.transactionId,
      razorpayPaymentId: request.razorpayPaymentId,
      razorpaySignature: request.razorpaySignature,
    };

    return this.appService.update(
      request.id,
      dto,
      request.userId,
      request.email,
    );
  }
}
