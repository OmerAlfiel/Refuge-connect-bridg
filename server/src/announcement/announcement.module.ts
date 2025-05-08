import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Announcement } from './entities/announcement.entity';
import { AnnouncementSubscription } from './entities/announcement-subscription.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

import { WebsocketModule } from '../webSocket/websocket.module';
import { AnnouncementsController } from './announcement.controller';
import { AnnouncementsService } from './announcement.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, AnnouncementSubscription, User]),
    NotificationsModule,
    MailModule,
    WebsocketModule,
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}