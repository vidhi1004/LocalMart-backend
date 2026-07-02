import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  CreateUserDto,
  DeleteUserDto,
  LoginUserDto,
  LogoutUserDto,
  RefreshTokenDto,
  UpdateUserDto,
} from './auth';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guad';
import { Role } from 'src/enum/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const requestUserId = Number(req.user.id);
    return this.authService.getUserById(requestUserId);
  }
  @SetMetadata('role', Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('refresh_token')
  getRefreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.reGenerateRefreshToken(refreshTokenDto);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(updateUserDto, id);
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Body() logoutUserDto: LogoutUserDto) {
    return this.authService.logout(logoutUserDto);
  }
  @UseGuards(AuthGuard)
  @Post('delete/:id')
  deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.authService.deleteUser(deleteUserDto);
  }
}
