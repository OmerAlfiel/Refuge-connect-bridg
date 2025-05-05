import { PartialType } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';
import { IsEnum, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { OfferStatus } from '../interfaces/offer.enum';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @ApiProperty({ enum: OfferStatus, required: false })
  @IsOptional()
  @IsEnum(OfferStatus)
  status?: OfferStatus;
}