import { Controller, Post, Body } from '@nestjs/common';
import { User } from 'generated/prisma';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {} // inject AuthService

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<User> { // trả về 1 cái promise chứa user
    return this.authService.register(body); // gọi hàm register từ AuthService
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<any> {
    return this.authService.login(body);
  }
} 
