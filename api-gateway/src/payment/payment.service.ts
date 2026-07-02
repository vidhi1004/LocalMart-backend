import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreatePaymentDto,
  Empty,
  GetPaymentByIdDto,
  PAYMENT_SERVICE_NAME,
  PaymentServiceClient,
  UpdatePaymentDto,
} from './payment';
import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PaymentService implements OnModuleInit {
  private paymentService!: PaymentServiceClient;
  constructor(
    @Inject('PAYMENT_PACKAGE')
    private readonly paymentServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentServiceClient.getService<PaymentServiceClient>(
        PAYMENT_SERVICE_NAME,
      );
  }

  createPayment(request: CreatePaymentDto) {
    return this.paymentService.createPayment(request);
  }

  getAllPayments(request: Empty) {
    return this.paymentService.getAllPayments(request);
  }

  getPaymentById(request: GetPaymentByIdDto) {
    return this.paymentService.getPaymentById(request);
  }

  updatePayment(request: UpdatePaymentDto) {
    return this.paymentService.updatePayment(request);
  }
}
