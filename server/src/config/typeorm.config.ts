import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Need } from 'src/needs/entities/need.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Conversation } from 'src/messages/entities/conversation.entity';
import { Announcement } from 'src/announcement/entities/announcement.entity';
import { AnnouncementSubscription } from 'src/announcement/entities/announcement-subscription.entity';
import { Location } from 'src/geolocation/entities/geolocation.entity';
import { Service } from 'src/geolocation/entities/service.entity';
import { ContactInfo } from 'src/geolocation/entities/contact-info.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [
    User, Need, Offer, Match, Message, Notification, 
    Conversation, Announcement, AnnouncementSubscription,
    Location, Service, ContactInfo
  ],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migration',
});