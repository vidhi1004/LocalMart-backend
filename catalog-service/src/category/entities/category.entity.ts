import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column({
    unique: true,
    nullable: false,
  })
  name: string;
  @Column({})
  description: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
