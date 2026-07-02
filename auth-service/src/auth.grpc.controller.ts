import { Controller } from '@nestjs/common';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CreateUserDto,
  DeleteUserDto,
  Empty,
  GetUserByIdDto,
  LoginResponse,
  LoginUserDto,
  LogoutUserDto,
  RefreshTokenDto,
  RefreshTokenResponse,
  UpdateUserDto,
  User,
  UserProfile,
  Users,
} from './auth';
import { AuthService } from './app.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async registerUser(request: CreateUserDto): Promise<User> {
    return this.authService.registerUser(request);
  }

  async login(request: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  async refreshToken(request: RefreshTokenDto): Promise<RefreshTokenResponse> {
    return this.authService.reGenerateRefreshToken(request);
  }

  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  async getUserById(request: GetUserByIdDto): Promise<UserProfile> {
    return this.authService.getUserById(request.id);
  }

  async logout(request: LogoutUserDto): Promise<Empty> {
    return this.authService.logout(request.id);
  }
  async deleteUser(request: DeleteUserDto): Promise<Empty> {
    return this.authService.deleteUser(request.id);
  }

  async updateUser(request: UpdateUserDto): Promise<User> {
    return this.authService.updateUser(request, request.id);
  }
}
