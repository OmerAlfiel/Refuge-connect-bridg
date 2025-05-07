import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MessagesGateway.name);
  private userSocketMap = new Map<string, string[]>();

  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Client trying to connect: ${client.id}`);
      
      const token = client.handshake.auth?.token || 
                    client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.warn(`No token provided by client ${client.id}`);
        client.disconnect();
        return;
      }
  
      try {
        const payload = this.jwtService.verify(token);
        const userId = payload.sub;
        this.logger.log(`Token verified for user ID: ${userId}`);
        
        const user = await this.usersService.findOne(userId);
        if (!user) {
          this.logger.warn(`User not found for ID: ${userId}`);
          client.disconnect();
          return;
        }
  
        // Store user data and track socket
        client.data.user = user;
        if (!this.userSocketMap.has(userId)) {
          this.userSocketMap.set(userId, []);
        }
        this.userSocketMap.get(userId).push(client.id);

        client.join(`user:${userId}`);
        this.logger.log(`Client connected: ${client.id}, user: ${userId} (${user.email})`);
      } catch (error) {
        this.logger.error(`Token verification failed: ${error.message}`);
        client.disconnect();
      }
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user?.id;
    if (userId) {
      const sockets = this.userSocketMap.get(userId);
      if (sockets) {
        const index = sockets.indexOf(client.id);
        if (index !== -1) {
          sockets.splice(index, 1);
          if (sockets.length === 0) {
            this.userSocketMap.delete(userId);
          }
        }
      }
    }
    this.logger.log(`Client disconnected: ${client.id}, user: ${userId || 'unknown'}`);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      this.logger.log(`Message received from ${client.data.user.id} for conversation ${createMessageDto.conversationId}`);
      
      const message = await this.messagesService.createMessage(
        client.data.user.id,
        createMessageDto,
      );

      // Get conversation to find recipients
      const conversation = await this.messagesService.getConversationById(
        createMessageDto.conversationId,
        client.data.user.id,
      );

      // Emit to all participants except sender
      conversation.participants.forEach(participant => {
        if (participant.id !== client.data.user.id) {
          this.server.to(`user:${participant.id}`).emit('newMessage', {
            message,
            conversation: {
              id: conversation.id,
              lastMessage: createMessageDto.content,
              lastMessageAt: new Date(),
            },
          });
        }
      });

      return message;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      return { error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      await this.messagesService.markAsRead(data.conversationId, client.data.user.id);
      
      // Get conversation to find other participants
      const conversation = await this.messagesService.getConversationById(
        data.conversationId,
        client.data.user.id,
      );

      // Emit read status to other participants
      conversation.participants.forEach(participant => {
        if (participant.id !== client.data.user.id) {
          this.server.to(`user:${participant.id}`).emit('messagesRead', {
            conversationId: data.conversationId,
            userId: client.data.user.id,
          });
        }
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error marking as read: ${error.message}`);
      return { error: error.message };
    }
  }
}