import { Category } from 'src/category/entities/category.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { ProductVariant } from 'src/product-variant/entities/product-variant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  brand: string;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({ default: true })
  isActive: boolean;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @OneToMany(() => ProductVariant, (variants) => variants.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (images) => images.product)
  images: ProductImage[];
}
