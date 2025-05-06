import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '../interfaces/match.enum';

export class MatchQueryDto {
  @ApiProperty({ required: false, enum: MatchStatus })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  needId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  offerId?: string;
}