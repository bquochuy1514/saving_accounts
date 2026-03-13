import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from 'generated/prisma/client';

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
}
