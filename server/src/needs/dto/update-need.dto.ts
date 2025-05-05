import { PartialType } from '@nestjs/swagger';
import { CreateNeedDto } from './create-need.dto';
import { IsEnum, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { NeedStatus } from '../interfaces/need-category.enum';

export class UpdateNeedDto extends PartialType(CreateNeedDto) {
  @ApiProperty({ enum: NeedStatus, required: false })
  @IsOptional()
  @IsEnum(NeedStatus)
  status?: NeedStatus;
}