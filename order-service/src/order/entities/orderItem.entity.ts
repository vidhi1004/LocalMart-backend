import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column()
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subtotal: number;

  @Column()
  productId: number;

  @Column()
  productVariantId: number;

  @Column()
  productName: string;

  @Column()
  sku: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
