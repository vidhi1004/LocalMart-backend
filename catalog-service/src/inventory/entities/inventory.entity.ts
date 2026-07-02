import { ProductVariant } from 'src/product-variant/entities/product-variant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    default: 0,
  })
  stock: number;

  @Column({
    default: 0,
  })
  reservedStock: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ProductVariant, (productVariant) => productVariant.inventory)
  @JoinColumn()
  productVariant: ProductVariant;
}
