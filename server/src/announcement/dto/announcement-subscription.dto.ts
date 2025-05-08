import { IsEmail, IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementSubscriptionDto {
  @ApiProperty({ description: 'Email to subscribe for announcements' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Categories to subscribe to', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: 'Regions to subscribe to', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];
}