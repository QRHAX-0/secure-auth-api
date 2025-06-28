import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { payloadDto } from '../dtos/payload.dto';

@Injectable()
export class JwtRefStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token as string;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET || 'default-secret',
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: payloadDto) {
    // تأكد من وجود الـ refresh token في الـ cookies
    const refreshToken = req?.cookies?.refresh_token as string;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    // جيب الـ user من الـ database
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub, // استخدم payload.sub مش payload.id
      },
    });

    if (!user || !user.refreshToken) {
      throw new Error('User not found or refresh token invalid');
    }

    // تحقق من صحة الـ refresh token

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new Error('Invalid refresh token');
    }

    // أرجع الـ user data (ده اللي هيروح للـ controller)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
