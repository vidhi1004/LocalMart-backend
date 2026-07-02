import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  CATALOG_PACKAGE_NAME,
  CATALOG_SERVICE_NAME,
  CatalogServiceClient,
  CreateCategoryDto,
  CreateInventoryDto,
  CreateProductDto,
  CreateProductImageDto,
  CreateProductVariantDto,
  DeleteCategoryDto,
  DeleteInventoryDto,
  DeleteProductDto,
  DeleteProductImageDto,
  DeleteProductVariantDto,
  Empty,
  GetCategoryByIdDto,
  GetInventoryByIdDto,
  GetProductByIdDto,
  GetProductImageByIdDto,
  GetProductVariantByIdDto,
  UpdateCategoryDto,
  UpdateInventoryDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductVariantDto,
} from './catalog';
import { firstValueFrom } from 'rxjs';
import { mapSize } from 'src/enum/enum.mapper';

@Injectable()
export class CatalogService implements OnModuleInit {
  private catalogService!: CatalogServiceClient;

  constructor(
    @Inject('CATALOG_PACKAGE')
    private readonly catalogServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.catalogService =
      this.catalogServiceClient.getService<CatalogServiceClient>(
        CATALOG_SERVICE_NAME,
      );
  }

  async getAllProducts(request: Empty) {
    const response = await firstValueFrom(
      this.catalogService.getAllProducts(request),
    );

    return {
      ...response,
      products: response.products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
          ...variant,
          size: mapSize(variant.size),
        })),
      })),
    };
  }

  async getProductById(request: GetProductByIdDto) {
    const product = await firstValueFrom(
      this.catalogService.getProductById(request),
    );

    return {
      ...product,
      variants: product.variants.map((variant) => ({
        ...variant,
        size: mapSize(variant.size),
      })),
    };
  }

  createProduct(request: CreateProductDto) {
    return this.catalogService.createProduct(request);
  }
  updateProduct(request: UpdateProductDto) {
    return this.catalogService.updateProduct(request);
  }

  deleteProduct(request: DeleteProductDto) {
    return this.catalogService.deleteProduct(request);
  }

  createCategory(request: CreateCategoryDto) {
    return this.catalogService.createCategory(request);
  }

  getAllCategories(request: Empty) {
    return this.catalogService.getAllCategories(request);
  }

  getCategoryById(request: GetCategoryByIdDto) {
    return this.catalogService.getCategoryById(request);
  }

  updateCategory(request: UpdateCategoryDto) {
    return this.catalogService.updateCategory(request);
  }

  deleteCategory(request: DeleteCategoryDto) {
    return this.deleteCategory(request);
  }

  createProductVariant(request: CreateProductVariantDto) {
    return this.catalogService.createProductVariant(request);
  }

  async getAllProductVariants(request: Empty) {
    const response = await firstValueFrom(
      this.catalogService.getAllProductVariants(request),
    );
    return {
      ...response,
      productVariants: response.productVariants.map((productVariant) => ({
        ...productVariant,
        size: mapSize(productVariant.size),
      })),
    };
  }

  async getProductVariantById(request: GetProductVariantByIdDto) {
    const productVarinat = await firstValueFrom(
      this.catalogService.getProductVariantById(request),
    );

    return {
      ...productVarinat,
      size: mapSize(productVarinat.size),
    };
  }

  async getProductVariantByVariantId(request: GetProductVariantByIdDto) {
    const productVarinat = await firstValueFrom(
      this.catalogService.getProductVariantByVariantId(request),
    );

    return {
      ...productVarinat,
      size: mapSize(productVarinat.size),
    };
  }

  updateProductVariant(request: UpdateProductVariantDto) {
    return this.catalogService.updateProductVariant(request);
  }

  deleteProductVariant(request: DeleteProductVariantDto) {
    return this.catalogService.deleteProductImage(request);
  }

  createProductImage(request: CreateProductImageDto) {
    return this.catalogService.createProductImage(request);
  }

  getAllProductImages(request: Empty) {
    return this.catalogService.getAllProductImages;
  }

  getProductImageById(request: GetProductImageByIdDto) {
    return this.getProductImageById(request);
  }

  updateProductImage(request: UpdateProductImageDto) {
    return this.catalogService.updateProductImage(request);
  }
  deleteProductImage(request: DeleteProductImageDto) {
    return this.catalogService.deleteProductImage(request);
  }
  createInventory(request: CreateInventoryDto) {
    return this.catalogService.createInventory(request);
  }

  getAllInventories(request: Empty) {
    return this.catalogService.getAllInventories(request);
  }
  getInventoryById(request: GetInventoryByIdDto) {
    return this.catalogService.getInventoryById(request);
  }

  updateInventory(request: UpdateInventoryDto) {
    return this.catalogService.updateInventory(request);
  }
  deleteInventory(request: DeleteInventoryDto) {
    return this.catalogService.deleteInventory(request);
  }
}
