import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateOrderDto,
  DeleteOrderDto,
  Empty,
  GetMyOrderDto,
  GetOrderByIdAdminDto,
  GetOrderByIdDto,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
  UpdateOrderDto,
} from './order';
import type { ClientGrpc } from '@nestjs/microservices';
import { mapOrderStatus } from 'src/enum/enum.mapper';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
  private orderService!: OrderServiceClient;
  constructor(
    @Inject('ORDER_PACKAGE')
    private readonly orderServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderServiceClient.getService<OrderServiceClient>(
        ORDER_SERVICE_NAME,
      );
  }

  async createOrder(request: CreateOrderDto) {
    const order = await firstValueFrom(this.orderService.createOrder(request));
    return order;
  }

  async getAllOrders(request: Empty) {
    const response = await firstValueFrom(
      this.orderService.getAllOrders(request),
    );

    return {
      ...response,
      orders: response.orders.map((order) => ({
        ...order,
        status: mapOrderStatus(order.status),
      })),
    };
  }
  async getMyOrder(request: GetMyOrderDto) {
    const response = await firstValueFrom(
      this.orderService.getMyOrder(request),
    );

    console.log({
      ...response,
      orders: response.orders.map((order) => ({
        ...order,
        status: mapOrderStatus(order.status),
      })),
    });

    return {
      ...response,
      orders: response.orders.map((order) => ({
        ...order,
        status: mapOrderStatus(order.status),
      })),
    };
  }

  async getOrderById(request: GetOrderByIdDto) {
    const order = await firstValueFrom(this.orderService.getOrderById(request));

    console.log({
      ...order,
      status: mapOrderStatus(order.status),
    });
    return {
      ...order,
      status: mapOrderStatus(order.status),
    };
  }

  async getOrderByIdAdmin(request: GetOrderByIdAdminDto) {
    const order = await firstValueFrom(
      this.orderService.getOrderByIdAdmin(request),
    );

    console.log({
      ...order,
      status: mapOrderStatus(order.status),
    });
    return {
      ...order,
      status: mapOrderStatus(order.status),
    };
  }
  updateOrder(request: UpdateOrderDto) {
    return this.orderService.updateOrder(request);
  }

  deleteOrder(request: DeleteOrderDto) {
    return this.orderService.deleteOrder(request);
  }
}
