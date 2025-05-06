import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '../interfaces/match.enum';

export class UpdateMatchDto {
  @ApiProperty({ enum: MatchStatus })
  @IsEnum(MatchStatus)
  status: MatchStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;
}