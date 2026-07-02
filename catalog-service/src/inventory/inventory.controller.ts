import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/enum/role.enum';
import { EventPattern } from '@nestjs/microservices';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @UseGuards(AuthGuard, RoleGuard)
  @SetMetadata('role', Role.ADMIN)
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @SetMetadata('role', Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @SetMetadata('role', Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
  @EventPattern('order.created')
  async handleOrderCreated(data: { items: any[] }) {
    try {
      if (data && data.items) {
        for (const item of data.items) {
          await this.inventoryService.reserveStock(
            item.productVariantId,
            item.quantity,
          );
        }
      }
    } catch (error) {
      console.error('Error processing order.created event:', error);
    }
  }

  @EventPattern('order.confirmed')
  async handleOrderConfirmed(data: { order: any }) {
    console.log(data);
    try {
      if (data && data.order && data.order.items) {
        for (const item of data.order.items) {
          console.log(item.quantity);
          console.log(item.productVariantId);
          await this.inventoryService.orderConfirmed(
            item.productVariantId,
            item.quantity,
          );
        }
      }
    } catch (error) {
      console.error('Error processing order.confirmed event:', error);
    }
  }
  @EventPattern('order.cancelled')
  async handleOrderCancel(data: { order: any }) {
    try {
      if (data && data.order && data.order.items) {
        for (const item of data.order.items) {
          await this.inventoryService.orderCancelled(
            item.productVariantId,
            item.quantity,
          );
        }
      }
    } catch (error) {
      console.error('Error processing order.cancelled event:', error);
    }
  }
}
