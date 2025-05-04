import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../interfaces/user-role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password',
    example: 'password123',
    minLength: 6
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.REFUGEE,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'The preferred language of the user',
    example: 'en'
  })
  @IsString()
  language: string;

  @ApiPropertyOptional({
    description: 'Contact information of the user',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiPropertyOptional({
    description: 'Location details of the user',
    example: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
    }
  })
  @IsOptional()
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    country?: string;
  };
}