import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'ID of the user receiving the notification' })
  @IsNotEmpty()
  @IsUUID()
  recipientId: string;

  @ApiProperty({ description: 'Optional ID of the related entity (match, message, etc.)', required: false })
  @IsOptional()
  @IsString()
  entityId?: string;
}