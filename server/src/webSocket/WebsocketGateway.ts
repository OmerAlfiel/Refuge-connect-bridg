import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [
      'https://refuge-connect-bridg.vercel.app', 
      'https://www.refuge-connect-bridg.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);
  private userSocketMap = new Map<string, string[]>();

  constructor(
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
        client.data = { user }; // Fix here: Initialize client.data object
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
    this.logger.log(`Emitted ${event} to user: ${userId} with data: ${JSON.stringify(data)}`);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.debug(`Emitted ${event} to all connected clients`);
  }

  getUserConnections(userId: string): string[] {
    return this.userSocketMap.get(userId) || [];
  }

  isUserOnline(userId: string): boolean {
    const connections = this.userSocketMap.get(userId);
    return !!connections && connections.length > 0;
  }
}