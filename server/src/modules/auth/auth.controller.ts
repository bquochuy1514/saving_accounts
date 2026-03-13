import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful!')
  login(@Body() loginDto: LoginDto) {
    return this.authService.handleLogin(loginDto);
  }

  @Post('register')
  @ResponseMessage('Registration successful!')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  refreshToken(@Req() req) {
    return this.authService.handleRefreshToken(req.user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@Req() req) {
    return this.authService.handleLogout(req.user);
  }
}
