
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { NeedsModule } from '../needs/needs.module';
import { OffersModule } from '../offers/offers.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    NeedsModule,
    OffersModule
  ],
  controllers: [MatchesController],
  providers: [MatchesService, RolesGuard, JwtStrategy],
  exports: [MatchesService],
})
export class MatchesModule {}