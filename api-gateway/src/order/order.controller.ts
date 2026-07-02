import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import type { CreateOrderDto, UpdateOrderDto } from './order';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guad';
import { Role } from 'src/enum/role.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @UseGuards(AuthGuard)
  @Post()
  createOrder(@Body() request: CreateOrderDto, @Req() req) {
    return this.orderService.createOrder({
      ...request,
      userId: Number(req.user.id),
      email: req.user.email,
    });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getAllOrder() {
    return this.orderService.getAllOrders({});
  }
  @UseGuards(AuthGuard)
  @Get('my')
  getMyOrder(@Req() req) {
    const id = Number(req.user.id);
    return this.orderService.getMyOrder({ id });
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.orderService.getOrderById({ id, userId });
  }

  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('admin/:id')
  getOrderByAdminId(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderByIdAdmin({ id });
  }

  // @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder({
      ...updateOrderDto,
      id,
    });
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteOrder(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.orderService.deleteOrder({ id, userId });
  }
}
