import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly CategoryRepo: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const categoryId = createProductDto.categoryId;
    const category = await this.CategoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category does not exists');
    }
    const product = this.ProductRepo.create({ ...createProductDto, category });

    const savedProducts = await this.ProductRepo.save(product);
    return savedProducts;
  }

  async findAll() {
    const products = await this.ProductRepo.find({
      where: {
        isActive: true,
      },
      relations: {
        images: true,
        category: true,
        variants: {
          inventory: true,
        },
      },
    });
    console.log(products[0]);
    return { products };
  }

  async findOne(id: number) {
    const product = await this.ProductRepo.findOne({
      where: { id, isActive: true },
      relations: {
        images: true,
        category: true,
        variants: {
          inventory: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.ProductRepo.findOne({
      where: { id, isActive: true },
      relations: {
        images: true,
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.categoryId) {
      const category = await this.CategoryRepo.findOne({
        where: {
          id: updateProductDto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with id ${updateProductDto.categoryId} not found`,
        );
      }
    }

    const updateProduct = Object.assign(product, updateProductDto);
    await this.ProductRepo.save(updateProduct);
    const updatedProduct = await this.ProductRepo.findOne({
      where: { id },
      relations: {
        category: true,
        variants: true,
        images: true,
      },
    });
    if (!updatedProduct) {
      throw new NotFoundException('Product not found after update');
    }

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.ProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    product.isActive = false;
    await this.ProductRepo.save(product);
    return `Product with Id ${id} and Name ${product.name} removed successfully`;
  }
}
