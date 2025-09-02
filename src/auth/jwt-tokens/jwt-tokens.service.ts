import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';
import { JwtTokensDto } from '../dto/jwt-tokens.dto';

@Injectable()
export class JwtTokensService {
  constructor(private jwtService: JwtService) {}

  generateTokens(payload: JwtUserPayload): JwtTokensDto {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }
}
