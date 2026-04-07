/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from 'generated/prisma/client';
import { createDeflate } from 'node:zlib';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateHashedRefreshToken(id: number, hashedRefreshToken: string) {
    return this.prisma.user.update({
      where: { id },
      data: { hashedRefreshToken },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      omit: { password: true },
    });
  }

  async handleGetUserProfile(userId: any) {
    const user = await this.findUserById(userId);

    if (!user) throw new UnauthorizedException('User not found!');

    const { password, hashedRefreshToken, ...formatedUser } = user;

    return formatedUser;
  }

  async handleGetAllUsers() {
    return await this.prisma.user.findMany({
      omit: {
        hashedRefreshToken: true,
        password: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async handleChangeUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    const { role, userId } = updateUserRoleDto;
    return await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      omit: { password: true, hashedRefreshToken: true },
    });
  }

  async handleToggleLockUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: !user.isActive,
      },
      omit: {
        password: true,
        hashedRefreshToken: true,
      },
    });
  }
}
