import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.MANAGER)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return this.usersService.handleGetUserProfile(req.user.id);
  }
}
