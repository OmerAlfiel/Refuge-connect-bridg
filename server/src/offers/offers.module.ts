import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  controllers: [OffersController],
  providers: [OffersService, RolesGuard, JwtStrategy],
  exports: [OffersService],
})
export class OffersModule {}