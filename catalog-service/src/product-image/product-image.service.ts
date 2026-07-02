import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}
  async create(createProductImageDto: CreateProductImageDto) {
    const product = await this.productRepo.findOne({
      where: {
        id: createProductImageDto.productId,
      },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    const image = this.productImageRepo.create({
      ...createProductImageDto,
      product,
    });

    return await this.productImageRepo.save(image);
  }

  async findAll() {
    const images = await this.productImageRepo.find();
    return {
      productImages: images,
    };
  }

  async findOne(id: number) {
    const image = await this.productImageRepo.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('No image found');
    }
    return image;
  }

  async update(id: number, updateProductImageDto: UpdateProductImageDto) {
    const image = await this.productImageRepo.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('No image found');
    }
    const newImage = Object.assign(image, updateProductImageDto);

    return await this.productImageRepo.save(newImage);
  }

  async remove(id: number) {
    const image = await this.productImageRepo.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('No image found');
    }
    await this.productImageRepo.delete(image);
    return 'Image Deleted Successfully';
  }
}
