import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import { refreshToken } from './entity/refreshToken.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from './enum/role.enum';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Empty } from './auth';
import { cookies } from 'supertest';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(refreshToken)
    private readonly refreshTokenRepo: Repository<refreshToken>,
    private readonly configService: ConfigService,
  ) {}

  async getAllUsers() {
    return await this.userRepo.find();
  }

  async getUserById(id: number): Promise<Users> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(` user with id ${id} not found`);
    }
    return user;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<Users> {
    const password = createUserDto.password;
    const hashPassword = await bcrypt.hash(password, 10);
    const email = createUserDto.email;
    const duplicateEmail = await this.userRepo.findOne({ where: { email } });
    if (!duplicateEmail) {
      const newCustomer = this.userRepo.create({
        ...createUserDto,
        password: hashPassword,
      });
      return this.userRepo.save(newCustomer);
    } else {
      throw new UnauthorizedException('Email Already Exists');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Incorrect email');
    }
    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword) {
      throw new UnauthorizedException('Invalid Password');
    }
    const { token, refresh_token } = await this.jwtToken(
      user.id,
      user.email,
      user.role,
    );
    const refreshToken = this.refreshTokenRepo.create({
      token: refresh_token,
      user: user,
      expiresAt: expiresAt,
    });
    await this.refreshTokenRepo.save(refreshToken);

    return { token, refresh_token };
  }

  private async jwtToken(id: number, email: string, role: Role) {
    const secret = this.configService.get('JWT_SECRET');
    const expiresAt = this.configService.get('JWT_EXPIRES_IN');
    const refreshToken_secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const refreshToken_expiresAt = this.configService.get(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
    const payload = { id, email, role };
    const token = jwt.sign(payload, secret, { expiresIn: expiresAt });
    const refresh_token = jwt.sign(payload, refreshToken_secret, {
      expiresIn: refreshToken_expiresAt,
    });
    return { token, refresh_token };
  }

  async reGenerateRefreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ token: string; refresh_token: string }> {
    const secret = this.configService.get('JWT_SECRET');
    const expiresAt = this.configService.get('JWT_EXPIRES_IN');
    const refreshToken_secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const refreshToken_expiresAt = this.configService.get(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
    const token = refreshTokenDto.refresh_token;
    let data;
    try {
      data = jwt.verify(token, refreshToken_secret);
      console.log(data);
    } catch (error) {
      return error;
    }
    const payload = { id: data.id, email: data.email, role: data.role };
    const TokenData = await this.refreshTokenRepo.findOne({ where: { token } });
    if (!TokenData) {
      throw new UnauthorizedException('invalid credentials');
    }

    const access_token = jwt.sign(payload, secret, { expiresIn: expiresAt });
    const refresh_token = jwt.sign(payload, refreshToken_secret, {
      expiresIn: refreshToken_expiresAt,
    });
    TokenData.token = refresh_token;
    await this.refreshTokenRepo.save(TokenData);
    return { token, refresh_token };
  }

  async logout(id: number): Promise<string> {
    // if (id !== userId) {
    //   throw new UnauthorizedException('Not Authorized');
    // }
    try {
      await this.refreshTokenRepo.delete({ user: { id: id } });
      return 'Logout Successfull';
    } catch (error) {
      return 'Logout Failed';
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, id: number) {
    // if (id !== userId) {
    //   throw new UnauthorizedException('Not Authorized');
    // }
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(` user with id ${id} not found`);
    }
    const newData = Object.assign(user, updateUserDto);
    return await this.userRepo.save(newData);
  }

  async deleteUser(id: number) {
    // if (id !== userId) {
    //   throw new UnauthorizedException('Not Authorized');
    // }
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(` user with id ${id} not found`);
    }
    await this.userRepo.delete(user);
    return 'User deleted Successfully';
  }
}
