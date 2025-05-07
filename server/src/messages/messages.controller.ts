import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(
    @Request() req,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.messagesService.createConversation(
      req.user.id,
      createConversationDto,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for current user' })
  async getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a specific conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async getConversation(@Request() req, @Param('id') id: string) {
    return this.messagesService.getConversationById(id, req.user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async getMessages(@Request() req, @Param('id') id: string) {
    return this.messagesService.getMessages(id, req.user.id);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Create a new message' })
  async createMessage(
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(req.user.id, createMessageDto);
  }

  @Patch('conversations/:id/read')
  @ApiOperation({ summary: 'Mark all messages in conversation as read' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async markAsRead(@Request() req, @Param('id') id: string) {
    await this.messagesService.markAsRead(id, req.user.id);
    return { success: true };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get count of unread messages' })
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user.id);
    return { count };
  }
}