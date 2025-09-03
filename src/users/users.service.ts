import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser({
    name,
    email,
    password,
  }: CreateUserDto): Promise<UserResponseDto | null> {
    const passwordHash = await argon2.hash(password);

    return this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: { id: true, name: true, email: true },
    });
  }

  async getUserById(userId: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
  }

  async updateUserById(
    userId: string,
    { name }: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true },
    });
  }

  async deleteUser(userId: string): Promise<UserResponseDto> {
    return this.prisma.user.delete({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
  }

  async changeEmail(
    userId: string,
    { newEmail, password }: ChangeEmailDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const isPasswordValid = await argon2.verify(user!.passwordHash, password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
      select: { id: true, name: true, email: true },
    });
  }

  async changePassword(
    userId: string,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const isPasswordValid = await argon2.verify(
      user!.passwordHash,
      currentPassword,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const newPasswordHash = await argon2.hash(newPassword);

    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
      select: { id: true, name: true, email: true },
    });
  }

  async createGoogleUser({
    id,
    name,
    email,
  }: CreateGoogleUserDto): Promise<UserResponseDto | null> {
    return this.prisma.user.create({
      data: {
        id,
        name,
        email,
        passwordHash: '',
      },
      select: { id: true, name: true, email: true },
    });
  }
}
