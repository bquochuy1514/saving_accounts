import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllUsers() {
    return this.usersService.handleGetAllUsers();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.usersService.handleGetUserProfile(req.user.id);
  }

  @Put('/change-user-role')
  @ResponseMessage('Cập nhật vai trò người dùng thành công!')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  changeUserRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersService.handleChangeUserRole(updateUserRoleDto);
  }

  @Put(':id/toggle-lock')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  toggleLockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.handleToggleLockUser(id);
  }
}
