import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: string): Promise<Offer> {
    const offer = this.offersRepository.create({
      ...createOfferDto,
      userId,
    });
    return await this.offersRepository.save(offer);
  }

  async findAll(queryParams?: any): Promise<Offer[]> {
    const queryBuilder = this.offersRepository.createQueryBuilder('offer');
    queryBuilder.leftJoinAndSelect('offer.user', 'user');
    
    if (queryParams) {
      if (queryParams.category) {
        queryBuilder.andWhere('offer.category = :category', { category: queryParams.category });
      }
      
      if (queryParams.status) {
        queryBuilder.andWhere('offer.status = :status', { status: queryParams.status });
      }
      
      if (queryParams.search) {
        queryBuilder.andWhere(
          '(offer.title ILIKE :search OR offer.description ILIKE :search)',
          { search: `%${queryParams.search}%` }
        );
      }

      if (queryParams.location) {
        queryBuilder.andWhere('offer.location->>.city ILIKE :city', { city: `%${queryParams.location}%` });
      }
    }
    
    queryBuilder.orderBy('offer.createdAt', 'DESC');
    return await queryBuilder.getMany();
  }

  async findByUser(userId: string): Promise<Offer[]> {
    return await this.offersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }
    
    return offer;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto, userId: string): Promise<Offer> {
    const offer = await this.findOne(id);
    
    if (offer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this offer');
    }
    
    await this.offersRepository.update(id, updateOfferDto);
    return await this.findOne(id);
  }

  async incrementHelpedCount(id: string): Promise<Offer> {
    const offer = await this.findOne(id);
    offer.helpedCount += 1;
    return await this.offersRepository.save(offer);
  }

  async remove(id: string, userId: string): Promise<void> {
    const offer = await this.findOne(id);
    
    if (offer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this offer');
    }
    
    await this.offersRepository.delete(id);
  }
}