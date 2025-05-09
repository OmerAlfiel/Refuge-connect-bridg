import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Need } from '../needs/entities/need.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Match } from '../matches/entities/match.entity';
import { Message } from '../messages/entities/message.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Conversation } from '../messages/entities/conversation.entity';
import { Announcement } from '../announcement/entities/announcement.entity';
import { AnnouncementSubscription } from '../announcement/entities/announcement-subscription.entity';
import { Location } from '../geolocation/entities/geolocation.entity';
import { Service } from '../geolocation/entities/service.entity';
import { ContactInfo } from '../geolocation/entities/contact-info.entity';

config();

async function runMigrations() {
  console.log('Starting migrations...');
  
  const configService = new ConfigService();
  
  // Use DATABASE_URL if available (Railway provides this)
  const connectionOptions: any = {
    type: 'postgres',
    entities: [
      User, Need, Offer, Match, Message, Notification, 
      Conversation, Announcement, AnnouncementSubscription,
      Location, Service, ContactInfo
    ],
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migration',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };

  if (process.env.DATABASE_URL) {
    connectionOptions.url = process.env.DATABASE_URL;
  } else {
    connectionOptions.host = configService.get('DATABASE_HOST');
    connectionOptions.port = configService.get('DATABASE_PORT');
    connectionOptions.username = configService.get('DATABASE_USER');
    connectionOptions.password = configService.get('DATABASE_PASSWORD');
    connectionOptions.database = configService.get('DATABASE_NAME');
  }

  const dataSource = new DataSource(connectionOptions);

  try {
    await dataSource.initialize();
    console.log('Data source initialized');

    // Create uuid-ossp extension if it doesn't exist (needed for uuid_generate_v4())
    try {
      await dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      console.log('uuid-ossp extension enabled');
    } catch (error) {
      console.error('Error creating extension:', error);
    }

    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations completed successfully');

    await dataSource.destroy();
    console.log('Data source closed');

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigrations();