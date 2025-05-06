import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';
import { Need } from './entities/need.entity';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Need])],
  controllers: [NeedsController],
  providers: [NeedsService, RolesGuard, JwtStrategy],
  exports: [NeedsService],
})
export class NeedsModule {}