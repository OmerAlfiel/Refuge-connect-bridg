import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementSubscription } from './entities/announcement-subscription.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementSubscriptionDto } from './dto/announcement-subscription.dto';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

import { MailService } from '../mail/mail.service';
import { WebsocketGateway } from '../webSocket/WebsocketGateway';
import { NotificationType } from '../notifications/entities/notification.entity';




@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(AnnouncementSubscription)
    private readonly subscriptionRepository: Repository<AnnouncementSubscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly mailService: MailService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, currentUser: User): Promise<Announcement> {
    // Ensure only admins and NGOs can create announcements
    if (currentUser.role !== 'admin' && currentUser.role !== 'ngo') {
      throw new ForbiddenException('Only admins and NGOs can create announcements');
    }

    const announcement = this.announcementRepository.create({
      ...createAnnouncementDto,
      postedById: currentUser.id,
      postedBy: currentUser,
    });

    const savedAnnouncement = await this.announcementRepository.save(announcement);

    // Notify subscribers via email
    this.notifySubscribers(savedAnnouncement).catch(err => 
      this.logger.error(`Failed to notify subscribers: ${err.message}`)
    );

    // Create notifications for users
    this.createUserNotifications(savedAnnouncement).catch(err => 
      this.logger.error(`Failed to create user notifications: ${err.message}`)
    );

    return savedAnnouncement;
  }

  async findAll(query?: { category?: string; region?: string; important?: boolean }): Promise<Announcement[]> {
    const queryBuilder = this.announcementRepository.createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.postedBy', 'user')
      .orderBy('announcement.createdAt', 'DESC');

    if (query?.category) {
      queryBuilder.andWhere('announcement.category = :category', { category: query.category });
    }

    if (query?.region) {
      queryBuilder.andWhere('announcement.region = :region', { region: query.region });
    }

    if (query?.important) {
      queryBuilder.andWhere('announcement.important = :important', { important: query.important });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['postedBy'],
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID "${id}" not found`);
    }

    return announcement;
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto, currentUser: User): Promise<Announcement> {
    const announcement = await this.findOne(id);

    // Check if user has permission to update
    if (announcement.postedById !== currentUser.id && currentUser.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this announcement');
    }

    // Update the announcement
    const updatedAnnouncement = this.announcementRepository.merge(announcement, updateAnnouncementDto);
    return this.announcementRepository.save(updatedAnnouncement);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const announcement = await this.findOne(id);

    // Check if user has permission to delete
    if (announcement.postedById !== currentUser.id && currentUser.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this announcement');
    }

    await this.announcementRepository.remove(announcement);
  }

  async subscribe(subscriptionDto: AnnouncementSubscriptionDto): Promise<AnnouncementSubscription> {
    // Check if already subscribed
    let subscription = await this.subscriptionRepository.findOne({
      where: { email: subscriptionDto.email },
    });

    if (subscription) {
      // Update existing subscription
      subscription.categories = subscriptionDto.categories || subscription.categories;
      subscription.regions = subscriptionDto.regions || subscription.regions;
    } else {
      // Create new subscription
      subscription = this.subscriptionRepository.create({
        email: subscriptionDto.email,
        categories: subscriptionDto.categories || [],
        regions: subscriptionDto.regions || [],
      });
    }

    return this.subscriptionRepository.save(subscription);
  }

  async unsubscribe(email: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { email },
    });

    if (subscription) {
      await this.subscriptionRepository.remove(subscription);
    }
  }

  private async notifySubscribers(announcement: Announcement): Promise<void> {
    // Find relevant subscribers based on category and region
    const subscribers = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.categories IS NULL OR subscription.categories LIKE :category', {
        category: `%${announcement.category}%`,
      })
      .andWhere('subscription.regions IS NULL OR subscription.regions LIKE :region', {
        region: `%${announcement.region}%`,
      })
      .getMany();

    // Send emails to subscribers
    for (const subscriber of subscribers) {
      try {
        await this.mailService.sendAnnouncementNotification(
          subscriber.email,
          announcement.title,
          announcement.content,
          announcement.region,
          announcement.category,
          announcement.important,
          announcement.eventDate
        );
      } catch (error) {
        this.logger.warn(`Failed to send email to ${subscriber.email}: ${error.message}`);
      }
    }
  }

  private async createUserNotifications(announcement: Announcement): Promise<void> {
    // Get users that might be interested based on region and role
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.region = :region OR user.role = :adminRole OR user.role = :ngoRole', {
        region: announcement.region,
        adminRole: 'admin',
        ngoRole: 'ngo',
      })
      .getMany();

    // Create in-app notification for each user
    for (const user of users) {
      try {
        await this.notificationsService.create({
          title: announcement.important ? `[IMPORTANT] ${announcement.title}` : announcement.title,
          description: announcement.content.substring(0, 100) + (announcement.content.length > 100 ? '...' : ''),
          type: NotificationType.ANNOUNCEMENT,
          recipientId: user.id,
          entityId: announcement.id,
        });
      } catch (error) {
        this.logger.warn(`Failed to create notification for user ${user.id}: ${error.message}`);
      }
    }

    // Broadcast websocket event for real-time updates
    this.websocketGateway.emitToAll('newAnnouncement', {
      id: announcement.id,
      title: announcement.title,
      important: announcement.important,
    });
  }
}