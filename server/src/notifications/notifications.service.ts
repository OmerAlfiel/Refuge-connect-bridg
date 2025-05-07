import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { User } from '../users/entities/user.entity';
// Fix the import path - match proper casing
import { WebsocketGateway } from '../webSocket/WebsocketGateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly webSocketGateway: WebsocketGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const recipient = await this.userRepository.findOne({
      where: { id: createNotificationDto.recipientId },
    });

    if (!recipient) {
      throw new NotFoundException(`User with ID ${createNotificationDto.recipientId} not found`);
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      recipient,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    
    // Emit WebSocket event
    this.webSocketGateway.emitToUser(
      createNotificationDto.recipientId, 
      'newNotification', 
      savedNotification
    );

    return savedNotification;
  }

  async findAll(userId: string, query: NotificationQueryDto): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.recipientId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (query.type) {
      queryBuilder.andWhere('notification.type = :type', { type: query.type });
    }

    if (query.read !== undefined) {
      queryBuilder.andWhere('notification.read = :read', { read: query.read });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, recipientId: userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found or you don't have access`);
    }

    return notification;
  }

  async update(id: string, userId: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id, userId);
    
    const updatedNotification = this.notificationRepository.merge(notification, updateNotificationDto);
    return this.notificationRepository.save(updatedNotification);
  }

  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);
    await this.notificationRepository.remove(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update()
      .set({ read: true })
      .where('recipientId = :userId', { userId })
      .andWhere('read = :read', { read: false })
      .execute();
      
    // Emit WebSocket event for UI update
    this.webSocketGateway.emitToUser(userId, 'notificationsRead', {});
  }

  async getUnreadCount(userId: string): Promise<number> {
    const count = await this.notificationRepository.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });
    return count;
  }
  
  async createSystemNotification(
    recipientId: string,
    title: string,
    description: string,
    entityId?: string,
  ): Promise<Notification> {
    return this.create({
      recipientId,
      title,
      description,
      type: NotificationType.SYSTEM,
      entityId,
    });
  }
  
  async createMatchNotification(
    recipientId: string,
    title: string,
    description: string,
    matchId: string,
  ): Promise<Notification> {
    return this.create({
      recipientId,
      title,
      description,
      type: NotificationType.MATCH,
      entityId: matchId,
    });
  }
  
  async createMessageNotification(
    recipientId: string,
    title: string,
    description: string,
    conversationId: string,
  ): Promise<Notification> {
    return this.create({
      recipientId,
      title,
      description,
      type: NotificationType.MESSAGE,
      entityId: conversationId,
    });
  }
}