import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class OtpStorageService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setOtp(email: string, otp: string, ttl: number = 300) {
    await this.redis.set(`otp:${email}`, otp, 'EX', ttl);
  }

  async getOtp(email: string): Promise<string | null> {
    return this.redis.get(`otp:${email}`);
  }

  async deleteOtp(email: string) {
    return this.redis.del(`otp:${email}`);
  }
}
