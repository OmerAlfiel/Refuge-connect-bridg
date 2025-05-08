import { Module } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { GeolocationController } from './geolocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { Location } from './entities/geolocation.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Service, ContactInfo]),
  ],
  controllers: [GeolocationController],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}