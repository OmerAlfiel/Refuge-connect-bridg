import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendAnnouncementNotification(
    email: string,
    title: string,
    content: string,
    region: string,
    category: string,
    important: boolean,
    eventDate?: Date
  ): Promise<void> {
    try {
      const unsubscribeUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/announcements/unsubscribe?email=${encodeURIComponent(email)}`;
      
      await this.mailerService.sendMail({
        to: email,
        subject: important ? `[IMPORTANT] New Announcement: ${title}` : `New Announcement: ${title}`,
        template: 'announcement',
        context: {
          title,
          content,
          region,
          category,
          important,
          eventDate: eventDate ? new Date(eventDate).toLocaleDateString() : null,
          unsubscribeUrl,
        },
      });
      
      this.logger.log(`Sent announcement email to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send announcement email to ${email}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Refuge Connect Bridge',
        template: 'welcome',
        context: {
          name,
          url: process.env.CLIENT_URL || 'http://localhost:3000',
        },
      });
      
      this.logger.log(`Sent welcome email to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'password-reset',
        context: {
          resetUrl,
        },
      });
      
      this.logger.log(`Sent password reset email to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
      throw error;
    }
  }

  async sendMatchNotification(
    email: string,
    needTitle: string,
    offerTitle: string,
    matchId: string
  ): Promise<void> {
    try {
      const matchUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/matches/${matchId}`;
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'New Match Found!',
        template: 'match-notification',
        context: {
          needTitle,
          offerTitle,
          matchUrl,
        },
      });
      
      this.logger.log(`Sent match notification email to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send match notification email to ${email}: ${error.message}`);
    }
  }
}