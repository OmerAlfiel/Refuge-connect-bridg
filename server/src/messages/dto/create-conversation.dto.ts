import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @ApiProperty({
    description: 'Array of user IDs to include in the conversation',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000']
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantIds: string[];

  @ApiPropertyOptional({
    description: 'Initial message to start the conversation',
    example: 'Hello, I would like to discuss your offer.'
  })
  @IsOptional()
  @IsString()
  initialMessage?: string;
}