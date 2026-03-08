import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import {
  comparePassword,
  hashPassword,
} from 'src/common/utils/hash-password.util';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(loginDto: LoginDto) {
    const existingUser = await this.usersService.findUserByEmail(
      loginDto.email,
    );
    if (!existingUser)
      throw new UnauthorizedException('Invalid email or password');

    const isPasswordMatch = await comparePassword(
      loginDto.password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password, ...user } = existingUser;

    return user;
  }

  handleLogin(loginDto: LoginDto) {
    return this.validateUser(loginDto);
  }

  async handleRegister(registerDto: RegisterDto) {
    // 1. Check existing user
    const existingUser = await this.usersService.findUserByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(
        'This email address already exists in the system. Please log in or choose a different email address.',
      );
    }

    // 2. Hash Password
    const hashedPassword = await hashPassword(registerDto.password);

    // 3. Create new user
    const newUser = await this.usersService.createUser({
      email: registerDto.email,
      fullname: registerDto.fullName,
      password: hashedPassword,
    });

    return newUser;
  }
}
