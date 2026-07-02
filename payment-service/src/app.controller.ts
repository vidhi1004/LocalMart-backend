import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/upate-payment.dto';
import { AuthGuard } from './auth/auth.guard';

@Controller('payment')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    const userId = Number(req.user.id);
    const token = req.token;
    return this.appService.create(createPaymentDto, userId);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.userId);
    return this.appService.findOne(id, userId);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updatePaymentDto: UpdatePaymentDto,
    @Req() req,
  ) {
    const userId = Number(req.user.id);
    const email = req.user.email;
    return this.appService.update(id, updatePaymentDto, userId, email);
  }
}
