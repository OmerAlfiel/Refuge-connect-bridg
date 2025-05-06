import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'], // Add more detailed logging
  });
  
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

   // Get database connection and check tables
   try {
    const dataSource = app.get(DataSource);
    
    // Log database tables
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Database tables:", tables.map(t => t.table_name));
    
    // Check if matches table exists and examine its structure
    const matchesTableExists = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'matches'
      )
    `);
    
    if (matchesTableExists[0].exists) {
      console.log("Matches table exists, examining structure...");
      const columns = await dataSource.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matches'
      `);
      console.log("Matches table columns:", columns);
    } else {
      console.log("Matches table doesn't exist, synchronizing schema...");
      await dataSource.synchronize(true);
      console.log("Schema synchronization complete");
    }
  } catch (error) {
    console.error("Database check error:", error);
  }
  
  
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
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  
  await app.listen(port);
  console.log(`Application running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api`);
  
  // Log database configuration
  const dbConfig = configService.get('database');
  console.log('Database configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Port: ${dbConfig.port}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  Synchronize: ${dbConfig.synchronize}`);
}
bootstrap();