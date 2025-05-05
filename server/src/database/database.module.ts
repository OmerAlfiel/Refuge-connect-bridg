import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseSeederService } from './database-seeder.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        
        const config = {
          ...configService.get('database'),
          entities: [User], // Explicitly add User entity
          synchronize: true,
          logging: true,
          logger: 'advanced-console',
        };
        
        logger.log('Attempting to connect to database with config:');
        logger.log(`Type: ${config.type}`);
        logger.log(`Host: ${config.host}`);
        logger.log(`Port: ${config.port}`);
        logger.log(`Database: ${config.database}`);
        logger.log(`Username: ${config.username}`);
        logger.log(`Synchronize: ${config.synchronize}`);
        logger.log(`Entities: ${config.entities.map(e => e.name).join(', ')}`);
        
        return config;
      },
    }),
  ],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseModule {}