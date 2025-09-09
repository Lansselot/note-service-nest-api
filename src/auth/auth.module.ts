import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtTokensModule } from './jwt-tokens/jwt-tokens.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { TokenStorageModule } from './token-storage/token-storage.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtTokensModule,
    TokenStorageModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
