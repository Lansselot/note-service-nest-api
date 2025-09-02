import { Inject, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { User } from 'generated/prisma';
import { randomUUID } from 'crypto';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';
import { JwtTokensService } from './jwt-tokens/jwt-tokens.service';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private jwtTokensService: JwtTokensService,
  ) {}

  private async createSessionAndGenerateTokens(
    userId: string,
    sessionId?: string,
  ): Promise<JwtTokensDto> {
    if (!sessionId) sessionId = randomUUID();
    const payload: JwtUserPayload = { userId, sessionId };
    const tokens = this.jwtTokensService.generateTokens(payload);

    await this.redis.set(
      `refresh:${userId}:${sessionId}`,
      tokens.refreshToken,
      'EX',
      60 * 60 * 24,
    );

    return tokens;
  }

  async validateUser({ email, password }: LoginUserDto): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return null;

    return user;
  }

  async login(userId: string) {
    return this.createSessionAndGenerateTokens(userId);
  }
}
