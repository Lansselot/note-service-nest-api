import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserPayload } from './decorators/user-payload.decorator';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserById(@UserPayload() userPayload: JwtUserPayload) {
    return this.usersService.getUserById(userPayload.userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateUserById(
    @UserPayload() userPayload: JwtUserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(userPayload.userId, updateUserDto);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  deleteUser(@UserPayload() userPayload: JwtUserPayload) {
    return this.usersService.deleteUser(userPayload.userId);
  }

  @Patch('change-email')
  @UseGuards(JwtAuthGuard)
  changeEmail(
    @UserPayload() userPayload: JwtUserPayload,
    @Body() data: ChangeEmailDto,
  ) {
    return this.usersService.changeEmail(userPayload.userId, data);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @UserPayload() userPayload: JwtUserPayload,
    @Body() data: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userPayload.userId, data);
  }
}
