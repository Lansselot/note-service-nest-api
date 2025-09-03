import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtUserPayload) {
    const refreshToken = (req.body as { refreshToken?: string })?.refreshToken;

    if (!payload || !refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const user = await this.authService.validateRefreshToken(
      payload.userId,
      payload.sessionId,
      refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    return { userId: payload.userId, sessionId: payload.sessionId };
  }
}
