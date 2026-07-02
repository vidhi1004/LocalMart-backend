import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  SetMetadata,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../order';
import { UpdateOrderDto } from '../order';
import { Role } from 'src/enum/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { Status } from 'src/enum/status.enum';

@Controller('order')
export class OrderController {
  //   constructor(private readonly orderService: OrderService) {}
  //   @UseGuards(AuthGuard)
  //   @Post()
  //   create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
  //     const userId = Number(req.user.id);
  //     const email = req.user.email;
  //     return this.orderService.create(userId, createOrderDto, email);
  //   }
  //   @SetMetadata('role', Role.ADMIN)
  //   @UseGuards(AuthGuard, RoleGuard)
  //   @Get()
  //   findAll() {
  //     return this.orderService.findAll();
  //   }
  //   @UseGuards(AuthGuard)
  //   findMyOrder(@Req() req) {
  //     const userId = Number(req.user.id);
  //     return this.orderService.getMyOrder(userId);
  //   }
  //   @UseGuards(AuthGuard)
  //   @Get(':id')
  //   findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
  //     const userId = Number(req.user.id);
  //     return this.orderService.findOne(id, userId);
  //   }
  //   @SetMetadata('role', Role.ADMIN)
  //   @UseGuards(AuthGuard, RoleGuard)
  //   @Patch(':id')
  //   update(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() updateOrderDto: UpdateOrderDto,
  //   ) {
  //     return this.orderService.update(id, updateOrderDto);
  //   }
  //   @UseGuards(AuthGuard)
  //   @Patch(':id/cancel')
  //   cancelOrder(@Param('id', ParseIntPipe) id: number, @Req() req) {
  //     const userId = Number(req.user.id);
  //     return this.orderService.cancelOrder(id, userId);
  //   }
  //   @EventPattern('payment.success')
  //   handlePaymentConfirmantion(data: any) {
  //     console.log(data);
  //     const id = data.orderId;
  //     const updateOrderDto = { status: Status.CONFIRMED };
  //     return this.orderService.update(id, updateOrderDto);
  //   }
  //   @EventPattern('payment.failed')
  //   handlePaymentFailure(data: any) {
  //     const id = data.orderId;
  //     const updateOrderDto = { status: Status.CANCELLED };
  //     return this.orderService.update(id, updateOrderDto);
  // }
}
