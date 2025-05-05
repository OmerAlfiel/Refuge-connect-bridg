import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NeedCategory } from '../interfaces/needs.enum';


class LocationDto {
  @ApiProperty()
  @IsNotEmpty()
  lat: number;

  @ApiProperty()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateNeedDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: NeedCategory })
  @IsEnum(NeedCategory)
  category: NeedCategory;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  urgent: boolean = false;

  @ApiProperty({ required: false, type: LocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}