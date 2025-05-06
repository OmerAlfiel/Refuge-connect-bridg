import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRole } from '../users/interfaces/user-role.enum';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit() { 
    try {
      this.logger.log('Checking database connection...');
      await this.dataSource.query('SELECT NOW()');
      this.logger.log('Database connection successful');
      
      // Reset database (drop tables and recreate enum)
      await this.resetDatabase();
      
      // Wait a moment for TypeORM to create the tables
      this.logger.log('Waiting for TypeORM to create tables...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // List all tables to confirm creation
      const tables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      this.logger.log(`Current tables in database: ${tables.map(t => t.table_name).join(', ') || 'none'}`);
      
      // If tables weren't created, log a warning
      if (tables.length === 0) {
        this.logger.warn('No tables were created by TypeORM synchronization. Check your entity configuration.');
      }
      
    } catch (error) {
      this.logger.error('Database initialization failed');
      this.logger.error(error.message);
      this.logger.error(error.stack);
    }
  }

  async resetDatabase() {
    this.logger.log('Resetting database schema...');
    
    try {
      // Create enum
      const roles = Object.values(UserRole).map(role => `'${role}'`).join(', ');
      await this.dataSource.query(`CREATE TYPE user_role_enum AS ENUM (${roles})`);
      this.logger.log('Enum type created successfully');
      
      // Force TypeORM to synchronize by checking query runner state
      this.logger.log('Triggering TypeORM synchronization...');
      await this.dataSource.synchronize(true);
      
      this.logger.log('Database reset completed. Tables will be created by TypeORM synchronization.');
    } catch (error) {
      this.logger.error('Error resetting database');
      this.logger.error(error.message);
      throw error;
    }
  }
}