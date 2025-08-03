import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber(undefined, { message: 'Invalid phone number format.' })
  @IsNotEmpty()
  phone: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  status: number;
}