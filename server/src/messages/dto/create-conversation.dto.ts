import { IsNotEmpty, IsArray, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ description: 'Array of participant user IDs (excluding the creator)' })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  participantIds: string[];

  @ApiProperty({ required: false, description: 'Initial message to send' })
  @IsOptional()
  @IsString()
  initialMessage?: string;
}