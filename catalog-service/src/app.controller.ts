import { Controller, Get } from '@nestjs/common';
//import { AppService } from './app.service';
import {
  CatalogServiceController,
  CatalogServiceControllerMethods,
  Categories,
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
  Product,
  UpdateInventoryDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductVariantDto,
} from './catalog';
import { CategoryService } from './category/category.service';
import { ProductService } from './product/product.service';
import { InventoryService } from './inventory/inventory.service';
import { ProductVariantService } from './product-variant/product-variant.service';
import { ProductImageService } from './product-image/product-image.service';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './category/dto/update-category.dto';

@Controller()
@CatalogServiceControllerMethods()
export class AppController implements CatalogServiceController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly productVariantService: ProductVariantService,
    private readonly productImageService: ProductImageService,
  ) {}
  //Category
  async createCategory(request: CreateCategoryDto) {
    return this.categoryService.create(request);
  }
  async updateCategory(request: UpdateProductDto) {
    return this.categoryService.update(request.id, request);
  }
  async getAllCategories(request: Empty): Promise<Categories> {
    return this.categoryService.findAll();
  }
  async getCategoryById(request: GetCategoryByIdDto) {
    return this.categoryService.findOne(request.id);
  }
  async deleteCategory(request: DeleteCategoryDto) {
    return this.categoryService.remove(request.id);
  }

  //Products

  async createProduct(request: CreateProductDto) {
    return this.productService.create(request);
  }

  async getAllProducts(request: Empty) {
    return this.productService.findAll();
  }
  async getProductById(request: GetProductByIdDto) {
    return this.productService.findOne(request.id);
  }
  async updateProduct(request: UpdateProductDto) {
    return this.productService.update(request.id, request);
  }
  async deleteProduct(request: DeleteProductDto) {
    return this.productService.remove(request.id);
  }

  //Product-Variant

  async createProductVariant(request: CreateProductVariantDto) {
    return this.productVariantService.create(request);
  }
  async getAllProductVariants(request: Empty) {
    return this.productVariantService.findAll();
  }
  async getProductVariantById(request: GetProductVariantByIdDto) {
    return this.productVariantService.findOne(request.id);
  }
  async getProductVariantByVariantId(request: GetProductVariantByIdDto) {
    return this.productVariantService.findByVariantId(request.id);
  }
  async updateProductVariant(request: UpdateProductVariantDto) {
    return this.productVariantService.update(request.id, request);
  }
  async deleteProductVariant(request: DeleteProductVariantDto) {
    return this.productVariantService.remove(request.id);
  }

  //Inventory

  async createInventory(request: CreateInventoryDto) {
    return this.inventoryService.create(request);
  }

  async getAllInventories(request: Empty) {
    return this.inventoryService.findAll();
  }
  async getInventoryById(request: GetInventoryByIdDto) {
    return this.inventoryService.findOne(request.id);
  }
  async updateInventory(request: UpdateInventoryDto) {
    return this.inventoryService.update(request.id, request);
  }
  async deleteInventory(request: DeleteInventoryDto) {
    return this.inventoryService.remove(request.id);
  }

  //Product-Image

  async createProductImage(request: CreateProductImageDto) {
    return this.productImageService.create(request);
  }

  async getAllProductImages(request: Empty) {
    return this.productImageService.findAll();
  }

  async getProductImageById(request: GetProductImageByIdDto) {
    return this.productImageService.findOne(request.id);
  }

  async updateProductImage(request: UpdateProductImageDto) {
    return this.productImageService.update(request.id, request);
  }
  async deleteProductImage(request: DeleteProductImageDto) {
    return this.productImageService.remove(request.id);
  }
}
