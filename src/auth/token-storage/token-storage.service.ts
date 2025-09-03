import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TokenStorageService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
    ttl: number = 60 * 60 * 24,
  ) {
    await this.redis.set(
      `refresh:${userId}:${sessionId}`,
      refreshToken,
      'EX',
      ttl,
    );
  }

  async getRefreshToken(
    userId: string,
    sessionId: string,
  ): Promise<string | null> {
    return this.redis.get(`refresh:${userId}:${sessionId}`);
  }

  async deleteRefreshToken(userId: string, sessionId: string) {
    await this.redis.del(`refresh:${userId}:${sessionId}`);
  }
}
