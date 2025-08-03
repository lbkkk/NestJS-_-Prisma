import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma'; // Import User type from Prisma Client
import { hash, compare } from 'bcrypt'; // Import bcryptjs for password hashing
import { JwtService } from '@nestjs/jwt'; // If you need JWT for authentication

@Injectable()
export class AuthService {

   // tạo constructor để inject PrismaService và JWT
  constructor(private readonly prismaService: PrismaService,
    private jwtService: JwtService) {}

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

  login = async (loginData: { email: string; password: string }): Promise<any> => {

    // check user exists
    const user = await this.prismaService.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new HttpException({ message: 'Account is not exist' }, HttpStatus.UNAUTHORIZED);
    }

    // check password
    const isPasswordValid = await compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException({ message: 'Invalid password' }, HttpStatus.UNAUTHORIZED);
    }

    // generate JWT (access + resfresh token)
    const payload = { id: user.id, name : user.name, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' });
    const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
