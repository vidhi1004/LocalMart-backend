import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CreateUserDto,
  LogoutUserDto,
  DeleteUserDto,
  RefreshTokenDto,
  UpdateUserDto,
  LoginUserDto,
} from './auth';
@Injectable()
export class AuthService implements OnModuleInit {
  private authService!: AuthServiceClient;

  constructor(
    @Inject('AUTH_PACKAGE')
    private readonly authServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.authServiceClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  login(loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  registerUser(createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  reGenerateRefreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  getUserById(id: number) {
    return this.authService.getUserById({ id });
  }

  updateUser(updateUserDto: UpdateUserDto, id: number) {
    return this.authService.updateUser({ ...updateUserDto, id });
  }

  logout(logoutUserDto: LogoutUserDto) {
    return this.authService.logout(logoutUserDto);
  }
  deleteUser(deleteUserDto: DeleteUserDto) {
    return this.authService.deleteUser(deleteUserDto);
  }
}
