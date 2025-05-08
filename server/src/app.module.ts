import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule as LocalConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { NeedsModule } from './needs/needs.module';
import { Need } from './needs/entities/need.entity';
import { OffersModule } from './offers/offers.module';
import { Offer } from './offers/entities/offer.entity';
import { MatchesModule } from './matches/matches.module';
import { Match } from './matches/entities/match.entity';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { WebsocketModule } from './webSocket/websocket.module';
import { Notification } from './notifications/entities/notification.entity';
import { AnnouncementsModule } from './announcement/announcement.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database'),
    }),
    LocalConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Need, Offer, Match, Message, Notification]),
    AuthModule,
    UsersModule,
    NeedsModule,
    OffersModule,
    MatchesModule,
    MessagesModule,
    NotificationsModule,
    WebsocketModule,
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        this.logger.log('Data source is initialized!');
        
        // Verify entity metadata is loaded
        const entities = this.dataSource.entityMetadatas;
        this.logger.log(`Registered entities: ${entities.map(e => e.name).join(', ')}`);
        
        // Check if the users table exists
        const tableExists = await this.dataSource.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
          )
        `);
        
        if (tableExists[0].exists) {
          this.logger.log('Users table exists in the database');
        } else {
          this.logger.warn('Users table does not exist in the database');
          
          // Try to create it manually if needed
          this.logger.log('Attempting to synchronize database...');
          await this.dataSource.synchronize();
          this.logger.log('Manual synchronization completed');
        }
      } else {
        this.logger.error('DataSource is not initialized!');
      }
    } catch (error) {
      this.logger.error('Database initialization check failed');
      this.logger.error(error.message);
    }
  }
}