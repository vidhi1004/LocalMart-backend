import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column()
  imageUrl: string;
  @Column({
    default: false,
  })
  isPrimary: boolean;
  @Column()
  displayOrder: number;
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
