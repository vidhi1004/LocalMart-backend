import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class refreshToken {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column()
  token: string;
  @Column()
  expiresAt: Date;
  @ManyToOne(() => Users, (user) => user.refreshTokens)
  user: Users;
}
