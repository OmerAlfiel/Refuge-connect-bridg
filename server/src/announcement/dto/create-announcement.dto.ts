import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Title of the announcement' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content of the announcement' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Category of the announcement' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Region or location for this announcement' })
  @IsNotEmpty()
  @IsString()
  region: string;

  @ApiProperty({ description: 'Whether this is an important announcement', default: false })
  @IsBoolean()
  important: boolean;

  @ApiProperty({ description: 'Date of the event (if applicable)', required: false })
  @IsOptional()
  @IsDateString()
  eventDate?: string;
}