import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderDto } from '../order';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { HttpService } from '@nestjs/axios';
import { Status as dbStatus } from '../enum/status.enum';
import { firstValueFrom } from 'rxjs';
import { INVENTORY_CLIENT, NOTIFICATION_CLIENT } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { mapGrpcStatus } from './mapper';
import { Status as GrpcStatus } from '../order';
import { mapDbStatus } from './reversemapper';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly httpService: HttpService,
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClinet: ClientProxy,
    @Inject(INVENTORY_CLIENT)
    private readonly inventoryClinet: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  private async getProduct(id: number) {
    const product = await firstValueFrom(
      this.httpService.get(`http://api-gateway:3000/catalog/products/${id}`),
    );
    return product.data;
  }

  private async getProductVariant(id: number) {
    const productVariant = await firstValueFrom(
      this.httpService.get(`http://api-gateway:3000/catalog/variants/id/${id}`),
    );
    return productVariant.data;
  }

  private async getInventory(id: number) {
    const inventory = await firstValueFrom(
      this.httpService.get(`http://api-gateway:3000/catalog/inventories/${id}`),
    );
    return inventory.data;
  }

  private async getShiprocketToken() {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://apiv2.shiprocket.in/v1/external/auth/login',
        {
          email: this.configService.get('SHIPPING_EMAIL'),
          password: this.configService.get('SHIPPING_PASSWORD'),
        },
      ),
    );
    return response.data.token;
  }

  private async createShiprocketOrder(order: Order, token: string) {
    const payload = {
      order_id: `ECOM-ORD-${order.id}-${order.userId}-${Date.now()}`,

      pickup_location: 'Home',
      order_date: order.createdAt.toISOString().split('T')[0],

      billing_customer_name: 'Customer',
      billing_last_name: 'User',
      billing_address: order.shippingAddress || 'M.G. Road Workspace',
      billing_city: order.shippingCity || 'Indore',
      billing_state: order.shippingState || 'Madhya Pradesh',
      billing_pincode: order.shippingPincode
        ? String(order.shippingPincode)
        : '452001',
      billing_country: 'India',
      billing_phone: order.shippingPhone
        ? String(order.shippingPhone)
        : '9876543210',
      shipping_is_billing: true,

      shipping_customer_name: 'Customer',
      shipping_last_name: 'User',
      shipping_address: order.shippingAddress || 'M.G. Road Workspace',
      shipping_city: order.shippingCity || 'Indore',
      shipping_state: order.shippingState || 'Madhya Pradesh',
      shipping_pincode: order.shippingPincode
        ? String(order.shippingPincode)
        : '452001',
      shipping_country: 'India',
      shipping_phone: order.shippingPhone
        ? String(order.shippingPhone)
        : '9876543210',
      order_items: order.items.map((item) => ({
        name: item.productName,
        sku: item.sku,
        units: item.quantity,
        selling_price: Number(item.unitPrice), // Fixed key mapping name
      })),
      payment_method: 'Prepaid',
      sub_total: Number(order.totalAmount),

      length: 20,
      breadth: 20,
      height: 20,
      weight: 0.5,
    };

    const response = await firstValueFrom(
      this.httpService.post(
        'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    return response.data;
  }

  async create(userId: number, createOrderDto: CreateOrderDto, email: string) {
    const items = createOrderDto.items;
    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];
    if (!items || items.length === 0) {
      throw new BadRequestException('ITEMS MUST BE PRESENT');
    }
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (!product) {
        throw new NotFoundException('Product does not exists');
      }
      const variant = await this.getProductVariant(item.productVariantId);
      if (!variant) {
        throw new NotFoundException('ProductVarient not availabe');
      }
      const inventory = await this.getInventory(item.productVariantId);
      if (!inventory) {
        throw new NotFoundException('Invetory not availabe');
      }
      if (inventory.stock < item.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const subtotal = variant.price * item.quantity;
      console.log(variant.price);
      console.log(item.quantity);
      console.log(subtotal);
      orderItems.push({
        productId: product.id,
        productVariantId: variant.id,
        productName: product.name,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice: variant.price,
        subtotal,
      });

      totalAmount += subtotal;
    }
    const order = this.orderRepo.create({
      userId: userId,
      status: dbStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      shippingCity: createOrderDto.shippingCity,
      shippingState: createOrderDto.shippingState,
      shippingPincode: createOrderDto.shippingPincode,
      shippingPhone: createOrderDto.shippingPhone,
      totalAmount: totalAmount,
    });

    const savedOrder = await this.orderRepo.save(order);

    for (const item of orderItems) {
      const orderItem = this.orderItemRepo.create({
        ...item,
        order: savedOrder,
      });
      await this.orderItemRepo.save(orderItem);
    }

    console.log(
      this.notificationClinet.emit('order.created', {
        id: savedOrder.id,
        userId,
        email,
        status: savedOrder.status,
        totalAmount,
      }),
    );
    this.inventoryClinet.emit('order.created', {
      items: createOrderDto.items,
    });
    const createdOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: {
        items: true,
      },
    });

    if (!createdOrder) {
      throw new NotFoundException('Order not found');
    }

    return {
      ...createdOrder,
      status: mapDbStatus(order.status),
      createdAt: createdOrder.createdAt.toISOString(),
      updatedAt: createdOrder.updatedAt.toISOString(),
    };
  }

  async findAll() {
    const orders = await this.orderRepo.find({
      relations: {
        items: true,
      },
    });
    return {
      orders: orders.map((order) => ({
        ...order,
        status: mapDbStatus(order.status),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
    };
  }

  async getMyOrder(userId: number) {
    const orders = await this.orderRepo.find({
      where: { userId },
      relations: {
        items: true,
      },
    });
    return {
      orders: orders.map((order) => ({
        ...order,
        status: mapDbStatus(order.status),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
    };
  }

  async findOne(id: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not Found');
    }
    console.log(order.userId);
    if (userId !== order.userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    return {
      ...order,
      status: mapDbStatus(order.status),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async findOneAdmin(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not Found');
    }
    return {
      ...order,
      status: mapDbStatus(order.status),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log('updateOrderDto:', updateOrderDto);
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with orderId ${id} Not Found`);
    }
    order.status = mapGrpcStatus(updateOrderDto.status);

    if (order.status === dbStatus.SHIPPED && !order.awbCode) {
      try {
        const token = await this.getShiprocketToken();
        const shippingResult = await this.createShiprocketOrder(order, token);

        if (shippingResult && shippingResult.shipment_id) {
          order.shipmentId = String(shippingResult.shipment_id);

          order.awbCode =
            shippingResult.awb_code || `SR${shippingResult.shipment_id}IN`;
          order.courierName = 'Blue Dart (Simulated via Shiprocket)';
        }
      } catch (error) {
        console.error(
          'Shiprocket Pipeline Error:',
          error.response?.data || error.message,
        );
      }
    }

    console.log('order:', order);

    if (order.status === dbStatus.CONFIRMED) {
      this.inventoryClinet.emit('order.confirmed', { order });
    }
    if (order.status === dbStatus.CANCELLED) {
      this.inventoryClinet.emit('order.cancelled', { order });
    }

    const saved = await this.orderRepo.save(order);

    return {
      ...saved,
      status: mapDbStatus(saved.status),
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with orderId ${id} Not Found`);
    }
    if (userId !== order.userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    if (order.status === dbStatus.DELIVERED) {
      throw new BadRequestException('ORDER AlREADY DELIVERED');
    }
    order.status = dbStatus.CANCELLED;
    await this.orderRepo.save(order);
    return `Order Cancelled successfully`;
  }
}
