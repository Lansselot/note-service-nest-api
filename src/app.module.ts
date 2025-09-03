import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtTokensModule } from './auth/jwt-tokens/jwt-tokens.module';
import { RedisModule } from './redis/redis.module';
import { TokenStorageModule } from './auth/token-storage/token-storage.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    JwtTokensModule,
    RedisModule,
    TokenStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
