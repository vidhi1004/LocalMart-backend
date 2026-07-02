import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { ProductVariant } from 'src/product-variant/entities/product-variant.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,
  ) {}
  async create(createInventoryDto: CreateInventoryDto) {
    const productVariant = await this.productVariantRepo.findOne({
      where: { id: createInventoryDto.productVariantId },
    });
    if (!productVariant) {
      throw new NotFoundException('Product Variant Not Found');
    }
    const IsInInventory = await this.inventoryRepo.findOne({
      where: {
        productVariant: {
          id: createInventoryDto.productVariantId,
        },
      },
    });
    if (IsInInventory) {
      throw new ConflictException('Invertory already exists');
    }
    const inventory = this.inventoryRepo.create({
      ...createInventoryDto,
      productVariant,
    });
    const savedInventory = await this.inventoryRepo.save(inventory);
    return {
      id: savedInventory.id,
      stock: savedInventory.stock,
      reservedStock: savedInventory.reservedStock,
      productVariantId: savedInventory.productVariant.id,
    };
  }

  async findAll() {
    const inventories = await this.inventoryRepo.find();
    return { inventories };
  }

  async findOne(id: number) {
    const inventory = await this.inventoryRepo.findOne({
      where: {
        productVariant: {
          id,
        },
      },
    });
    if (!inventory) {
      throw new NotFoundException(`inventory with id ${id} not found`);
    }
    return inventory;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepo.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`inventory with id ${id} not found`);
    }
    if (updateInventoryDto.productVariantId) {
      const productVariant = await this.productVariantRepo.findOne({
        where: {
          id: updateInventoryDto.productVariantId,
        },
      });

      if (!productVariant) {
        throw new NotFoundException('Product Variant Not Found');
      }
    }
    if (updateInventoryDto.stock !== undefined) {
      inventory.stock = updateInventoryDto.stock;
    }
    if (updateInventoryDto.reservedStock !== undefined) {
      inventory.reservedStock = updateInventoryDto.reservedStock;
    }
    return await this.inventoryRepo.save(inventory);
  }

  async reserveStock(productVariantId: number, quantity: number) {
    const inventory = await this.inventoryRepo.findOne({
      where: { productVariant: { id: productVariantId } },
    });

    if (!inventory) {
      console.error(`Inventory for Variant ID ${productVariantId} not found.`);
      return;
    }

    inventory.stock -= quantity;
    inventory.reservedStock += quantity;
    console.log(inventory);
    await this.inventoryRepo.save(inventory);
  }
  async orderConfirmed(productVariantId: number, quantity: number) {
    const inventory = await this.inventoryRepo.findOne({
      where: { productVariant: { id: productVariantId } },
    });
    if (!inventory) {
      throw new ConflictException('Inventory Not Found');
    }
    inventory.reservedStock = Math.max(0, inventory.reservedStock - quantity);
    console.log(inventory);
    await this.inventoryRepo.save(inventory);
  }
  async orderCancelled(productVariantId: number, quantity: number) {
    const inventory = await this.inventoryRepo.findOne({
      where: { productVariant: { id: productVariantId } },
    });
    if (!inventory) {
      throw new ConflictException('Inventory Not Found');
    }
    inventory.stock += quantity;

    inventory.reservedStock = Math.max(0, inventory.reservedStock - quantity);
    console.log(inventory);
    await this.inventoryRepo.save(inventory);
  }

  async remove(id: number) {
    const inventory = await this.inventoryRepo.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`inventory with id ${id} not found`);
    }
    return await this.inventoryRepo.remove(inventory);
  }
}
