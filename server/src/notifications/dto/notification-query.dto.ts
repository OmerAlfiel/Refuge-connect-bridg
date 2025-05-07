import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { NotificationType } from '../entities/notification.entity';

export class NotificationQueryDto {
  @ApiProperty({ description: 'Filter by notification type', required: false })
  @IsOptional()
  @IsEnum(NotificationType, { each: true })
  type?: NotificationType;

  @ApiProperty({ description: 'Filter by read status', required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  read?: boolean;
}