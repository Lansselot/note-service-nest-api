import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
import { randomUUID } from 'crypto';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';
import { JwtTokensService } from './jwt-tokens/jwt-tokens.service';
import { TokenStorageService } from './token-storage/token-storage.service';
import { UsersService } from 'src/users/users.service';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtTokensService: JwtTokensService,
    private tokenStorageService: TokenStorageService,
    private usersService: UsersService,
  ) {}

  async validateUser({ email, password }: LoginUserDto): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) return null;

    return user;
  }

  async createSessionAndGenerateTokens(
    userId: string,
    sessionId?: string,
  ): Promise<JwtTokensDto> {
    if (!sessionId) sessionId = randomUUID();
    const payload: JwtUserPayload = { userId, sessionId };
    const tokens = this.jwtTokensService.generateTokens(payload);

    const hashedRt = await argon2.hash(tokens.refreshToken);

    await this.tokenStorageService.setRefreshToken(
      userId,
      sessionId,
      hashedRt,
      60 * 60 * 24,
    );

    return tokens;
  }

  async validateRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
  ) {
    const rtHash = await this.tokenStorageService.getRefreshToken(
      userId,
      sessionId,
    );
    if (!rtHash) return null;

    const isRtValid = await argon2.verify(rtHash, refreshToken);
    if (!isRtValid) return null;

    return this.usersService.getUserById(userId);
  }

  async logout(userId: string, sessionId: string) {
    await this.tokenStorageService.deleteRefreshToken(userId, sessionId);
  }
}
