import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './auth/auth.guard';
import { Role } from './enum/role.enum';
import { RoleGuard } from './auth/role.guard';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
  @UseGuards(AuthGuard)
  @SetMetadata('role', Role['ADMIN'])
  @UseGuards(AuthGuard)
  @Get()
  getAllUsers() {
    return this.authService.getAllUsers();
  }
  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh_token')
  GetRefreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.reGenerateRefreshToken(refreshTokenDto);
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.authService.getUserById(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  UpdateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const userId = Number(req.user.id);
    return this.authService.updateUser(updateUserDto, id);
  }

  @UseGuards(RoleGuard)
  @Post(':id')
  logout(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.authService.logout(id);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.authService.deleteUser(id);
  }
}
