import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  
  // Enable CORS
  app.enableCors({
    origin: [
      'https://refuge-connect-bridg.vercel.app',
      'https://www.refuge-connect-bridg.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000' 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Get config service
  const configService = app.get(ConfigService);
  
  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Refuge Connect Bridge API')
    .setDescription('The Refuge Connect Bridge API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('needs', 'Need management endpoints')
    .addTag('offers', 'Offer management endpoints')
    .addTag('matches', 'Match management endpoints')
    .addTag('messages', 'Message management endpoints')
    .addTag('notifications', 'Notification management endpoints')
    .addTag('announcements', 'Announcement management endpoints')
    .addTag('locations', 'Location management endpoints')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || configService.get('port') || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();