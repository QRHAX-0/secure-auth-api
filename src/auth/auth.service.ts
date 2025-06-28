import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { registerDTO } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { loginDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: registerDTO, res: Response) {
    const exitUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exitUser) {
      throw new Error('User already exists');
    }

    const hashedPass = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPass },
    });

    // أنشئ الـ Tokens
    await this.generateTokens(user, res);

    // أرجع بيانات المستخدم بدون الباسورد
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }

  async validateUser({ email, password }: loginDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new Error('user not found');

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) throw new Error('wronge password');
    return user;
  }

  async login(
    user: { id: number; email: string; name: string },
    res: Response,
  ) {
    await this.generateTokens(user, res);

    return res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }

  async refreshToken(
    user: { id: number; email: string; name: string }, // ده هيجي من الـ strategy
    res: Response,
  ) {
    // الـ strategy خلاص تحققت من كل حاجة
    // هنا بس نولد tokens جديدة
    await this.generateTokens(user, res);

    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }

  async generateTokens(user: { id: number; email: string }, res: Response) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });

    // خزّن refresh token مشفّر
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    // أرسل الـ Tokens في الـ Cookies
    this.setCookies(res, accessToken, refreshToken);
  }

  setCookies(res: Response, accessToken: any, refreshToken: any) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
