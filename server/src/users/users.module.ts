
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserSubscriber } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService, TypeOrmModule.forFeature([User])], // Exporting TypeOrmModule for use in other modules
})
export class UsersModule {}