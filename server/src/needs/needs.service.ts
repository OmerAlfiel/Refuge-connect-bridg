import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Need } from './entities/need.entity';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { NeedStatus } from './interfaces/need-category.enum';

@Injectable()
export class NeedsService {
  constructor(
    @InjectRepository(Need)
    private needsRepository: Repository<Need>,
  ) {}

  async create(createNeedDto: CreateNeedDto, userId: string): Promise<Need> {
    const need = this.needsRepository.create({
      ...createNeedDto,
      userId: userId,
    });
    return await this.needsRepository.save(need);
  }

  async findAll(queryParams?: any): Promise<Need[]> {
    const queryBuilder = this.needsRepository.createQueryBuilder('need');
    queryBuilder.leftJoinAndSelect('need.user', 'user');
    
    // Apply filters if provided
    if (queryParams) {
      if (queryParams.category) {
        queryBuilder.andWhere('need.category = :category', { category: queryParams.category });
      }
      
      if (queryParams.urgent === 'true') {
        queryBuilder.andWhere('need.urgent = :urgent', { urgent: true });
      }
      
      if (queryParams.status) {
        queryBuilder.andWhere('need.status = :status', { status: queryParams.status });
      }
      
      if (queryParams.search) {
        queryBuilder.andWhere(
          '(need.title ILIKE :search OR need.description ILIKE :search)',
          { search: `%${queryParams.search}%` }
        );
      }
    }
    
    // Order by creation date, newest first
    queryBuilder.orderBy('need.createdAt', 'DESC');
    
    return await queryBuilder.getMany();
  }

  async findByUser(userId: string): Promise<Need[]> {
    return await this.needsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Need> {
    const need = await this.needsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!need) {
      throw new NotFoundException(`Need with ID ${id} not found`);
    }
    
    return need;
  }

  async update(id: string, updateNeedDto: UpdateNeedDto, userId: string): Promise<Need> {
    const need = await this.findOne(id);
    
    // Check if user owns this need or is an admin
    if (need.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this need');
    }
    
    await this.needsRepository.update(id, updateNeedDto);
    return await this.findOne(id);
  }

  async updateStatus(id: string, status: NeedStatus): Promise<Need> {
    const need = await this.findOne(id);
    need.status = status;
    return await this.needsRepository.save(need);
  }

  async remove(id: string, userId: string): Promise<void> {
    const need = await this.findOne(id);
    
    // Check if user owns this need or is an admin
    if (need.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this need');
    }
    
    await this.needsRepository.delete(id);
  }
}