import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../interfaces/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    country?: string;
  };
}