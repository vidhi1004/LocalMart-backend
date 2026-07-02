import { PaymentMode } from 'src/enum/paymentMode.enum';
import { PaymentStatus } from 'src/enum/paymentStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Payment {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column()
  orderId: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentstatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMode,
    default: PaymentMode.UNDEFINED,
  })
  paymentMode: PaymentMode;

  @Column({
    nullable: true,
  })
  transactionId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;
  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpaySignature: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
