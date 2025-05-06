import { IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { MatchStatus } from '../interfaces/match.enum';

export class CreateMatchDto {
  @IsOptional()
  @IsUUID()
  needId?: string | null;

  @IsOptional()
  @IsUUID()
  offerId?: string | null;

  @IsOptional()
  message?: string;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsUUID()
  initiatedBy?: string;
}