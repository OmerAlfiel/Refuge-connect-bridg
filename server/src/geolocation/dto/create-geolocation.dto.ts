import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationType } from '../entities/geolocation.entity';

class ServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class ContactInfoDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  hours?: string;
}

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['resource', 'medical', 'housing', 'legal', 'education', 'employment'])
  @IsNotEmpty()
  type: LocationType;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  @ArrayMinSize(1)
  services: ServiceDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;
}
