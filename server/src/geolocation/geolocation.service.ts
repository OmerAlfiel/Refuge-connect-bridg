import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between } from 'typeorm';
import { Location } from './entities/geolocation.entity';
import { Service } from './entities/service.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { QueryLocationsDto } from './dto/query-locations.dto';
import { CreateLocationDto } from './dto/create-geolocation.dto';
import { UpdateLocationDto } from './dto/update-geolocation.dto';

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
  ) {}

  async create(createLocationDto: CreateLocationDto, userId: string): Promise<Location> {
    // Create contact info if provided
    let contactInfo = null;
    if (createLocationDto.contactInfo) {
      contactInfo = this.contactInfoRepository.create(createLocationDto.contactInfo);
      await this.contactInfoRepository.save(contactInfo);
    }

    // Create the location
    const location = this.locationRepository.create({
      name: createLocationDto.name,
      type: createLocationDto.type,
      address: createLocationDto.address,
      lat: createLocationDto.lat,
      lng: createLocationDto.lng,
      description: createLocationDto.description,
      contactInfo: contactInfo,
      createdBy: userId
    });

    // Save the location to get its ID
    const savedLocation = await this.locationRepository.save(location);

    // Create services
    if (createLocationDto.services && createLocationDto.services.length > 0) {
      const services = createLocationDto.services.map(serviceDto => {
        return this.serviceRepository.create({
          name: serviceDto.name,
          location: savedLocation
        });
      });

      // Save the services
      await this.serviceRepository.save(services);

      // Associate services with the location
      savedLocation.services = services;
    }

    return savedLocation;
  }

  async findAll(query: QueryLocationsDto): Promise<Location[]> {
    const { search, type, lat, lng, radius } = query;
    
    // Build the where conditions
    const where: FindOptionsWhere<Location> = { isActive: true };
    
    // Filter by type if provided
    if (type && type !== 'all') {
      where.type = type as any;
    }
    
    // Search by name or description if provided
    if (search) {
      return this.locationRepository.createQueryBuilder('location')
        .leftJoinAndSelect('location.services', 'service')
        .leftJoinAndSelect('location.contactInfo', 'contactInfo')
        .where(where)
        .andWhere('(location.name LIKE :search OR location.description LIKE :search)', 
          { search: `%${search}%` })
        .getMany();
    }
    
    // If lat, lng, and radius are provided, filter by distance
    if (lat && lng && radius) {
      // Calculate the bounding box for a quicker first-pass filter
      const earthRadius = 6371; // earth radius in km
      const latRadian = lat * Math.PI / 180;
      
      // Approx. km per degree of latitude and longitude at this latitude
      const kmPerDegreeLat = 111.32; // constant
      const kmPerDegreeLng = Math.cos(latRadian) * 111.32;
      
      // Calculate the lat/lng bounds
      const latDelta = radius / kmPerDegreeLat;
      const lngDelta = radius / kmPerDegreeLng;
      
      const minLat = lat - latDelta;
      const maxLat = lat + latDelta;
      const minLng = lng - lngDelta;
      const maxLng = lng + lngDelta;
      
      // Get locations within the bounding box
      const locations = await this.locationRepository.find({
        where: {
          ...where,
          lat: Between(minLat, maxLat),
          lng: Between(minLng, maxLng)
        },
        relations: ['services', 'contactInfo']
      });
      
      // Further filter by actual Haversine distance
      return locations.filter(location => {
        const distance = this.calculateDistance(
          lat, lng,
          location.lat, location.lng
        );
        return distance <= radius;
      });
    }
    
    // Default query returns all active locations
    return this.locationRepository.find({
      where,
      relations: ['services', 'contactInfo']
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id, isActive: true },
      relations: ['services', 'contactInfo']
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(
    id: string, 
    updateLocationDto: UpdateLocationDto, 
    user: { id: string, roles: string[] }
  ): Promise<Location> {
    const location = await this.findOne(id);
    
    // Check if user has permission to update this location
    if (user.roles.includes('admin') || location.createdBy === user.id) {
      // Update contact info if provided
      if (updateLocationDto.contactInfo && location.contactInfo) {
        await this.contactInfoRepository.update(
          location.contactInfo.id, 
          updateLocationDto.contactInfo
        );
      } else if (updateLocationDto.contactInfo && !location.contactInfo) {
        // Create new contact info if it didn't exist before
        const contactInfo = this.contactInfoRepository.create(updateLocationDto.contactInfo);
        const savedContactInfo = await this.contactInfoRepository.save(contactInfo);
        location.contactInfo = savedContactInfo;
      }
      
      // Update basic location data
      if (updateLocationDto.name) location.name = updateLocationDto.name;
      if (updateLocationDto.type) location.type = updateLocationDto.type;
      if (updateLocationDto.address) location.address = updateLocationDto.address;
      if (updateLocationDto.lat !== undefined) location.lat = updateLocationDto.lat;
      if (updateLocationDto.lng !== undefined) location.lng = updateLocationDto.lng;
      if (updateLocationDto.description) location.description = updateLocationDto.description;
      
      // Update services if provided
      if (updateLocationDto.services && updateLocationDto.services.length > 0) {
        // Remove existing services
        if (location.services && location.services.length > 0) {
          await this.serviceRepository.remove(location.services);
        }
        
        // Create new services
        const services = updateLocationDto.services.map(serviceDto => {
          return this.serviceRepository.create({
            name: serviceDto.name,
            location: location
          });
        });
        
        // Save the new services
        await this.serviceRepository.save(services);
        location.services = services;
      }
      
      // Save and return the updated location
      return this.locationRepository.save(location);
    } else {
      throw new ForbiddenException('You do not have permission to update this location');
    }
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    
    // Soft delete by setting isActive to false
    location.isActive = false;
    await this.locationRepository.save(location);
  }

  // Helper method to calculate distance between two lat/lng points using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const earthRadius = 6371; // kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c; // distance in kilometers
  }
  
  private degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
}
