import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/guard/auth.guard';
import type { CreatePaymentDto, UpdatePaymentDto } from './payment';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post()
  createPayment(@Body() dto: CreatePaymentDto, @Req() req) {
    return this.paymentService.createPayment({
      ...dto,
      userId: Number(req.user.id),
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  getAllPayments() {
    return this.paymentService.getAllPayments({});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getPaymentById(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.paymentService.getPaymentById({
      id,
      userId: Number(req.user.id),
    });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
    @Req() req,
  ) {
    console.log('API GATEWAY REQUEST');
    console.log({
      ...dto,
      id,
      userId: Number(req.user.id),
      email: req.user.email,
    });
    return this.paymentService.updatePayment({
      ...dto,
      id,
      userId: Number(req.user.id),
      email: req.user.email,
    });
  }
}
