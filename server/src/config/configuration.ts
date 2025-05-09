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

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'refuge-connect-bridge-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '090690',
    database: process.env.DATABASE_NAME || 'refuge_connect_bridge',
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: false,
    } : false,
    entities: [
      User, Need, Offer, Match, Message, Notification, 
      Conversation, Announcement, AnnouncementSubscription,
      Location, Service, ContactInfo
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
    logging: process.env.NODE_ENV !== 'production',
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migration',
    migrationsRun: process.env.RUN_MIGRATIONS === 'true',
  }
});