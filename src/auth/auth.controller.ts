import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './dtos/register.dto';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/local.guard';
import { AccessTokenGuard } from './guards/jwt.guard';
import { JwtRefGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: registerDTO, @Res() res: Response) {
    return this.authService.register(data, res);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    return this.authService.login(
      req.user as { id: number; email: string; name: string },
      res,
    );
  }

  @UseGuards(JwtRefGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    // الـ user هيكون متاح في req.user بعد الـ strategy
    const user = req.user as { id: number; email: string; name: string };

    return await this.authService.refreshToken(user, res);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    // req.user هنا فيه البيانات الي رجعناها من validate()
    console.log(req.user as { id: number; email: string; name: string }); // المستخدم اسمه إيه
    // console.log(req.user.email); // إيميله إيه

    return req.user;
  }
}
