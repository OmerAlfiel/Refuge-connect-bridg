import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({ description: 'Whether the notification has been read' })
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @ApiProperty({ description: 'Whether action has been taken on the notification' })
  @IsOptional()
  @IsBoolean()
  actionTaken?: boolean;
}