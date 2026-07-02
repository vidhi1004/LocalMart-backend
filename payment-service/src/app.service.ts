import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './enum/paymentStatus.enum';
import { UpdatePaymentDto } from './dto/upate-payment.dto';
import type { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT, ORDER_CLIENT } from './constants';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { ORDER_SERVICE_NAME, OrderServiceClient, Status } from './order';
import { firstValueFrom } from 'rxjs';
// import { PaymentMode as ProtoPaymentMode } from './payment';
// import { PaymentMode as EntityPaymentMode } from './enum/paymentMode.enum';
@Injectable()
export class AppService {
  private readonly razorpayInstance: Razorpay;
  private orderService!: OrderServiceClient;

  constructor(
    @Inject('ORDER_PACKAGE')
    private readonly orderServiceClient: ClientGrpc,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
    @Inject(ORDER_CLIENT)
    private readonly orderClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.razorpayInstance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_API_KEY'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET_KEY'),
    });
  }
  onModuleInit() {
    this.orderService =
      this.orderServiceClient.getService<OrderServiceClient>(
        ORDER_SERVICE_NAME,
      );
  }
  private async getOrder(id: number, userId: number) {
    const order = await firstValueFrom(
      this.orderService.getOrderById({ id, userId }),
    );
    console.log(order);
    return order;
  }
  async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const order = await this.getOrder(createPaymentDto.orderId, userId);
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    if (order.userId !== userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    if (order.status === Status.PAID || order.status === Status.CANCELLED) {
      throw new BadRequestException('Not Allowed');
    }
    const existingPayment = await this.paymentRepo.findOne({
      where: { orderId: createPaymentDto.orderId },
    });
    if (existingPayment) {
      throw new BadRequestException('Payment Already exists');
    }
    const amount = order.totalAmount;
    let RazorpayOrder;
    try {
      RazorpayOrder = await this.razorpayInstance.orders.create({
        amount: Math.round(Number(order.totalAmount) * 100),
        currency: 'INR',
        receipt: `${createPaymentDto.orderId}`,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create razorpay gateway order');
    }

    const payment = this.paymentRepo.create({
      ...createPaymentDto,
      userId,
      amount,
      transactionId: RazorpayOrder.id,
      paymentstatus: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    console.log(savedPayment);

    return {
      ...savedPayment,
      razorpayOrderId: RazorpayOrder.id,
      // razorpayApiKey: this.configService.get('RAZORPAY_API_KEY'),
    };
  }

  async findAll() {
    const payments = await this.paymentRepo.find();
    return {
    payments: payments.map((payment) => ({
      ...payment,
      razorpayOrderId: payment.transactionId,
    })),
  };
}


  async findOne(id: number, userId: number) {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment Not Found');
    }
    if (userId !== payment.userId) {
      throw new UnauthorizedException('Not Authorized');
    }

    return {
      id: payment.id,
      userId: payment.userId,
      orderId: payment.orderId,
      paymentstatus: payment.paymentstatus,
      transactionId: payment.transactionId,
      paymentMode: payment.paymentMode,
      amount: payment.amount,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpaySignature: payment.razorpaySignature,
      razorpayOrderId: payment.transactionId,
    };
  }
  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
    userId: number,
    email: string,
  ) {
    // const paymentModeMap = {
    //   [ProtoPaymentMode.COD]: EntityPaymentMode.COD,
    //   [ProtoPaymentMode.UPI]: EntityPaymentMode.UPI,
    //   [ProtoPaymentMode.CARD]: EntityPaymentMode.CARD,
    //   [ProtoPaymentMode.UNDEFINED]: EntityPaymentMode.UNDEFINED,
    // };

    console.log('PAYMENT MODE:', updatePaymentDto.paymentMode);
    console.log('TYPE:', typeof updatePaymentDto.paymentMode);

    console.log('PAYMENT STATUS:', updatePaymentDto.paymentstatus);
    console.log('TYPE:', typeof updatePaymentDto.paymentstatus);
    const payment = await this.paymentRepo.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Not Found');
    }
    //payment.paymentMode = paymentModeMap[updatePaymentDto.paymentMode];
    if (payment.userId !== userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    if (payment.paymentstatus === PaymentStatus.REFUNDED) {
      throw new BadRequestException('You cannot modify refunded order');
    }
    if (payment.paymentstatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment Already Done');
    }
    if (updatePaymentDto.paymentstatus === PaymentStatus.SUCCESS) {
      if (
        !updatePaymentDto.razorpayPaymentId ||
        !updatePaymentDto.razorpaySignature
      ) {
        throw new BadRequestException(
          'Missing payment confirmation proofs from gateway',
        );
      }
      const body = `${payment.transactionId}|${updatePaymentDto.razorpayPaymentId}`;
      const razorpaySecret = this.configService.get<string>(
        'RAZORPAY_SECRET_KEY',
      );
      if (!razorpaySecret) {
        throw new BadRequestException('Razorpay secret key not configured');
      }
      const expectedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== updatePaymentDto.razorpaySignature) {
        throw new BadRequestException(
          'Payment verification failed. Security alert',
        );
      }
    }
    updatePaymentDto.transactionId = updatePaymentDto.razorpayPaymentId;
    const updatedPayment = Object.assign(payment, updatePaymentDto);
    const savedPayment = await this.paymentRepo.save(updatedPayment);
    if (savedPayment.paymentstatus === PaymentStatus.SUCCESS) {
      this.notificationClient.emit(`payment.success`, {
        ...savedPayment,
        email,
      });
    }
    if (savedPayment.paymentstatus === PaymentStatus.FAILED) {
      this.notificationClient.emit(`payment.failed`, {
        ...savedPayment,
        email,
      });
    }
    if (savedPayment.paymentstatus === PaymentStatus.REFUNDED) {
      this.notificationClient.emit(`payment.refunded`, {
        ...savedPayment,
        email,
      });
    }
    if (savedPayment.paymentstatus === PaymentStatus.SUCCESS) {
      this.orderClient.emit(`payment.success`, { ...savedPayment, email });
    }
    if (savedPayment.paymentstatus === PaymentStatus.FAILED) {
      this.orderClient.emit(`payment.failed`, { ...savedPayment, email });
    }
    if (savedPayment.paymentstatus === PaymentStatus.REFUNDED) {
      this.orderClient.emit(`payment.refunded`, { ...savedPayment, email });
    }
    return {
      ...savedPayment,
      razorpayOrderId: savedPayment.transactionId,
    };
  }
}
