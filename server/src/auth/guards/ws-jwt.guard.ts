import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // For WebSocket connections
    const client = context.switchToWs().getClient<Socket>();
    
    this.logger.debug(`Checking WebSocket authentication for client: ${client.id}`);
    
    // User should be attached during handleConnection
    if (!client.data?.user) {
      this.logger.warn(`No user data found for client: ${client.id}`);
      throw new WsException('Unauthorized - missing user data');
    }
    
    this.logger.debug(`User authenticated: ${client.data.user.id}`);
    return true;
  }
}