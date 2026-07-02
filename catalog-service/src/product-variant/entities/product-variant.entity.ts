import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Size } from '../enum/size.enum';
import { Product } from 'src/product/entities/product.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  sku: string;
  @Column({
    type: 'enum',
    enum: Size,
  })
  size: Size;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price',
  })
  price: number;
  @Column()
  color: string;
  @Column({
    default: true,
  })
  isActive: boolean;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @OneToOne(() => Inventory, (inventory) => inventory.productVariant)
  inventory: Inventory;
}
