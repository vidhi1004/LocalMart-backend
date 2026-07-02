import { Controller } from '@nestjs/common';
import { OrderService } from './order/order.service';
import {
  CreateOrderDto,
  DeleteOrderDto,
  Empty,
  GetMyOrderDto,
  GetOrderByIdAdminDto,
  GetOrderByIdDto,
  Order,
  OrderServiceController,
  OrderServiceControllerMethods,
  UpdateOrderDto,
} from './order';
import { Observable } from 'rxjs';

@Controller()
@OrderServiceControllerMethods()
export class AppController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  async createOrder(request: CreateOrderDto) {
    return this.orderService.create(request.userId, request, request.email);
  }
  async getAllOrders(request: Empty) {
    return this.orderService.findAll();
  }

  getMyOrder(request: GetMyOrderDto) {
    return this.orderService.getMyOrder(request.id);
  }

  async getOrderById(request: GetOrderByIdDto) {
    try {
      console.log('REQUEST:', request);

      const order = await this.orderService.findOne(request.id, request.userId);

      console.log('ORDER:', order);

      return order;
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async getOrderByIdAdmin(request: GetOrderByIdAdminDto) {
    try {
      const order = await this.orderService.findOneAdmin(request.id);

      return order;
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }

  async updateOrder(request: UpdateOrderDto) {
    return this.orderService.update(request.id, request);
  }

  async deleteOrder(request: DeleteOrderDto) {
    return this.orderService.cancelOrder(request.id, request.userId);
  }
}
