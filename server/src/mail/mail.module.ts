import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST', 'smtp.example.com'),
          port: config.get('MAIL_PORT', 587),
          secure: config.get('MAIL_SECURE', false),
          auth: {
            user: config.get('MAIL_USER', 'user@example.com'),
            pass: config.get('MAIL_PASSWORD', 'password'),
          },
        },
        defaults: {
          from: `"Refuge Connect Bridge" <${config.get('MAIL_FROM', 'noreply@refugeconnectbridge.org')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}