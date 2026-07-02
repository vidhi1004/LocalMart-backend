import { Role } from 'src/enum/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { refreshToken } from './refreshToken.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;
  @Column({
    name: 'email',
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    name: 'password',
    nullable: false,
  })
  password: string;
  @Column({
    name: 'firstName',
  })
  firstName: string;
  @Column({
    name: 'lastName',
  })
  lastName: string;
  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
    default: Role.USER,
  })
  role: Role;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => refreshToken, (token) => token.user)
  refreshTokens: refreshToken[];
}
