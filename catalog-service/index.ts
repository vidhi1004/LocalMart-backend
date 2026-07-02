import { Category } from 'src/category/entities/category.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { ProductVariant } from 'src/product-variant/entities/product-variant.entity';
import { Product } from 'src/product/entities/product.entity';

export const entities = [
  Category,
  Product,
  ProductVariant,
  Inventory,
  ProductImage,
];
