import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma'; // Import User type from Prisma Client
import { hash } from 'bcrypt'; // Import bcryptjs for password hashing

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {} // tạo constructor để inject PrismaService

  register = async (userData: RegisterDto): Promise<User> => {
    
    // check email
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new HttpException({message:'Email already exists'}, HttpStatus.BAD_REQUEST);
    }

    // hash password
    const hashedPassword = await hash(userData.password, 10);

    const res = await this.prismaService.user.create({
      data: { ...userData, password: hashedPassword}
    });

    return res; // trả về user đã được tạo
  }
}
