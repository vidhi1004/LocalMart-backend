import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guad';
import { Role } from 'src/enum/role.enum';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  getAllProducts() {
    return this.catalogService.getAllProducts({});
  }

  @Get('products/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getProductById({ id });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('products')
  createProduct(@Body() dto: any) {
    return this.catalogService.createProduct(dto);
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('products/:id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.catalogService.updateProduct({
      ...dto,
      id,
    });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('products/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.deleteProduct({ id });
  }

  @Get('categories')
  getAllCategories() {
    return this.catalogService.getAllCategories({});
  }

  @Get('categories/:id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getCategoryById({ id });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('categories')
  createCategory(@Body() dto: any) {
    return this.catalogService.createCategory(dto);
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.catalogService.updateCategory({
      ...dto,
      id,
    });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.deleteCategory({ id });
  }

  @Get('variants')
  getAllProductVariants() {
    return this.catalogService.getAllProductVariants({});
  }

  @Get('variants/id/:id')
  getProductVariantByVariantId(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getProductVariantByVariantId({ id });
  }

  @Get('variants/:id')
  getProductVariantById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getProductVariantById({ id });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('variants')
  createProductVariant(@Body() dto: any) {
    return this.catalogService.createProductVariant(dto);
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('variants/:id')
  updateProductVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.catalogService.updateProductVariant({
      ...dto,
      id,
    });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('variants/:id')
  deleteProductVariant(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.deleteProductVariant({ id });
  }

  @Get('images')
  getAllProductImages() {
    return this.catalogService.getAllProductImages({});
  }

  @Get('images/:id')
  getProductImageById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getProductImageById({ id });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('images')
  createProductImage(@Body() dto: any) {
    return this.catalogService.createProductImage(dto);
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('images/:id')
  updateProductImage(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.catalogService.updateProductImage({
      ...dto,
      id,
    });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('images/:id')
  deleteProductImage(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.deleteProductImage({ id });
  }

  @Get('inventories')
  getAllInventories() {
    return this.catalogService.getAllInventories({});
  }

  @Get('inventories/:id')
  getInventoryById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getInventoryById({ id });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('inventories')
  createInventory(@Body() dto: any) {
    return this.catalogService.createInventory(dto);
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('inventories/:id')
  updateInventory(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.catalogService.updateInventory({
      ...dto,
      id,
    });
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('inventories/:id')
  deleteInventory(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.deleteInventory({ id });
  }
}
