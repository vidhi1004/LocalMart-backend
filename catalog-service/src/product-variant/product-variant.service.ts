import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}
  async create(createProductVariantDto: CreateProductVariantDto) {
    const productId = createProductVariantDto.productId;
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product Not Found`);
    }
    const isSkuDuplicate = await this.productVariantRepo.findOne({
      where: { sku: createProductVariantDto.sku },
    });
    if (isSkuDuplicate) {
      throw new ConflictException('SKU already exists');
    }
    const newProductVariant = this.productVariantRepo.create({
      ...createProductVariantDto,
      product,
    });

    return await this.productVariantRepo.save(newProductVariant);
  }

  async findAll() {
    const variants = await this.productVariantRepo.find({
      where: {
        isActive: true,
      },
      relations: {
        inventory: true,
      },
    });
    return { productVariants: variants };
  }

  async findByVariantId(id: number) {
    const productVariant = await this.productVariantRepo.findOne({
      where: {
        id,
      },
      relations: {
        inventory: true,
      },
    });
    if (!productVariant) {
      throw new NotFoundException(`Product Variant with id ${id} not found`);
    }
    return productVariant;
  }

  async findOne(id: number) {
    const productVariant = await this.productVariantRepo.findOne({
      where: {
        product: {
          id,
        },
      },
      relations: {
        inventory: true,
      },
    });
    if (!productVariant) {
      throw new NotFoundException(`Product Variant with id ${id} not found`);
    }
    return productVariant;
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    const productVariant = await this.productVariantRepo.findOne({
      where: { id },
    });
    if (!productVariant) {
      throw new NotFoundException(`Product Variant with id ${id} not found`);
    }
    if (updateProductVariantDto.sku) {
      const isSkuDuplicate = await this.productVariantRepo.findOne({
        where: { sku: updateProductVariantDto.sku },
      });
      if (isSkuDuplicate) {
        throw new ConflictException('SKU already exists');
      }
    }

    if (updateProductVariantDto.productId) {
      const product = await this.productRepo.findOne({
        where: {
          id: updateProductVariantDto.productId,
        },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${updateProductVariantDto.productId} not Found`,
        );
      }
      productVariant.product = product;
    }

    const updatedProductVariant = Object.assign(
      productVariant,
      updateProductVariantDto,
    );
    return await this.productVariantRepo.save(updatedProductVariant);
  }

  async remove(id: number) {
    const productVariant = await this.productVariantRepo.findOne({
      where: { id },
    });
    if (!productVariant) {
      throw new NotFoundException(`Product Variant with id ${id} not found`);
    }
    productVariant.isActive = false;
    await this.productVariantRepo.save(productVariant);
    return `Product Variant with ${id} removed successfully`;
  }
}
