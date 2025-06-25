import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './dtos/register.dto';
import { Request, Response } from 'express';
import { loginDTO } from './dtos/login.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: registerDTO, @Res() res: Response) {
    return this.authService.register(data, res);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() data: loginDTO, @Res() res: Response, @Req() req: Request) {
    return this.authService.login(data, res);
  }
}
