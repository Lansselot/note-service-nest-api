import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from 'src/users/decorators/user-payload.decorator';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyOtpDto } from './otp/dto/verify-otp.dto';
import { RequestOtpDto } from './otp/dto/request-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@UserPayload() userPayload: JwtUserPayload) {
    return this.authService.createSessionAndGenerateTokens(userPayload.userId);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleLogin(@UserPayload() userPayload: JwtUserPayload) {
    return this.authService.createSessionAndGenerateTokens(userPayload.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@UserPayload() userPayload: JwtUserPayload) {
    return this.authService.createSessionAndGenerateTokens(
      userPayload.userId,
      userPayload.sessionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@UserPayload() userPayload: JwtUserPayload) {
    return this.authService.logout(userPayload.userId, userPayload.sessionId);
  }

  @Post('otp')
  @HttpCode(200)
  requestOtp(@Body() { email }: RequestOtpDto) {
    return this.authService.requestOtp(email);
  }

  @Post('otp/verify')
  @HttpCode(200)
  verifyOtp(@Body() { email, otp }: VerifyOtpDto) {
    return this.authService.verifyOtp(email, otp);
  }
}
