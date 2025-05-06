import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource, Brackets } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchQueryDto } from './dto/match-query.dto';
import { NeedsService } from '../needs/needs.service';
import { OffersService } from '../offers/offers.service';
import { MatchStatus } from './interfaces/match.enum';
import { NeedStatus } from 'src/needs/interfaces/need-category.enum';
import { Need } from 'src/needs/entities/need.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private needsService: NeedsService,
    private offersService: OffersService,
    private dataSource: DataSource
  ) {}

  async validateMatchEntities(needId: string | null, offerId: string | null): Promise<{ need?: Need; offer?: Offer }> {
    try {
      let need: Need | undefined;
      let offer: Offer | undefined;
      
      if (needId) {
        need = await this.needsService.findOne(needId);
        
      }
      
      if (offerId) {
        offer = await this.offersService.findOne(offerId);
      }
      
      // At least one of need or offer should be defined
      if (!need && !offer) {
        throw new ConflictException('Either need or offer must be provided');
      }
      
      return { need, offer };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Failed to validate match entities');
    }
  }

  // Improved category matching logic
  private categoriesMatch(needCategory: string, offerCategory: string): boolean {
    // Handle null/undefined values
    if (!needCategory || !offerCategory) return false;
    
    try {
      // Normalize categories for comparison
      const normalizedNeedCategory = String(needCategory).toLowerCase().trim();
      const normalizedOfferCategory = String(offerCategory).toLowerCase().trim();
      
      // Direct match
      if (normalizedNeedCategory === normalizedOfferCategory) {
        return true;
      }
      
      // Special case for shelter/housing equivalence
      if ((normalizedNeedCategory === 'shelter' && normalizedOfferCategory === 'housing') || 
          (normalizedNeedCategory === 'housing' && normalizedOfferCategory === 'shelter')) {
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
  
  async create(createMatchDto: CreateMatchDto, userId: string): Promise<Match> {
    try {
      // Validate need and offer existence
      const { need, offer } = await this.validateMatchEntities(
        createMatchDto.needId, 
        createMatchDto.offerId
      );
      
      // Check for category compatibility if both need and offer are provided
      if (need && offer) {
        
        if (need.status !== NeedStatus.OPEN) {
          throw new ConflictException(`Need is not open for matching (current status: ${need.status})`);
        }
        
        // Check for category compatibility using the improved method
        if (!this.categoriesMatch(need.category, offer.category)) {
          throw new ConflictException(`Category mismatch: Need category ${need.category} doesn't match offer category ${offer.category}`);
        }
      }
      
      // Check for existing match if both needId and offerId are provided
      if (createMatchDto.needId && createMatchDto.offerId) { 
        const existingMatch = await this.matchesRepository.findOne({
          where: {
            needId: createMatchDto.needId,
            offerId: createMatchDto.offerId,
          },
        });
        
        if (existingMatch) {
          throw new ConflictException(`A match already exists for this need and offer (status: ${existingMatch.status})`);
        }
      }
      
      // Create and save the match
      const match = this.matchesRepository.create({
        ...createMatchDto,
        initiatedBy: userId,
        status: createMatchDto.status || MatchStatus.PENDING
      });
      
      const savedMatch = await this.matchesRepository.save(match);
     
      
      return savedMatch;
    } catch (error) {
     
      throw error;
    }
  }
  
    async findAll(userId: string, queryDto?: MatchQueryDto): Promise<Match[]> {
      try {
       
  
        // Debug database state
        const totalMatches = await this.matchesRepository.count();
        
  
        // Get user's needs and offers
        const userNeeds = await this.needsService.findByUser(userId);
        const userOffers = await this.offersService.findByUser(userId);
  
        // Build query
        const queryBuilder = this.matchesRepository
          .createQueryBuilder('match')
          .leftJoinAndSelect('match.need', 'need')
          .leftJoinAndSelect('match.offer', 'offer')
          .leftJoinAndSelect('match.initiator', 'initiator')
          .leftJoinAndSelect('match.responder', 'responder')
          .where(new Brackets(qb => {
            qb.where('match.initiatedBy = :userId', { userId })
              .orWhere('match.respondedBy = :userId', { userId });
  
            if (userNeeds.length > 0) {
              qb.orWhere('match.needId IN (:...needIds)', { 
                needIds: userNeeds.map(n => n.id) 
              });
            }
  
            if (userOffers.length > 0) {
              qb.orWhere('match.offerId IN (:...offerIds)', { 
                offerIds: userOffers.map(o => o.id) 
              });
            }
          }));
  
        // Add status filter if provided
        if (queryDto?.status) {
          queryBuilder.andWhere('match.status = :status', { status: queryDto.status });
        }
  
        // Log the generated SQL
        const sql = queryBuilder.getSql();
        const params = queryBuilder.getParameters();
        // Execute query
        const matches = await queryBuilder.getMany();
        return matches;
      } catch (error) {
        throw error;
      }
    }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['need', 'offer', 'need.user', 'offer.user', 'initiator', 'responder'],
    });
    
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto, userId: string): Promise<Match> {
    const match = await this.findOne(id);
    
    // Check if the user has permission to update this match
    if (match.initiatedBy !== userId && match.respondedBy !== userId) {
      throw new ForbiddenException('You do not have permission to update this match');
    }
    
    // If the match is being accepted or rejected, record who responded
    if ((updateMatchDto.status === MatchStatus.ACCEPTED || updateMatchDto.status === MatchStatus.REJECTED) 
        && match.status === MatchStatus.PENDING) {
      match.respondedBy = userId;
    }
    
    // If the match is being accepted and there's a need, update the need status
    if (updateMatchDto.status === MatchStatus.ACCEPTED && match.status === MatchStatus.PENDING && match.needId) {
      await this.needsService.update(match.needId, { status: NeedStatus.MATCHED }, userId);
    }
    
    // If the match is being completed and there's a need, update the need status
    if (updateMatchDto.status === MatchStatus.COMPLETED && match.status === MatchStatus.ACCEPTED && match.needId) {
      await this.needsService.update(match.needId, { status: NeedStatus.FULFILLED }, userId);
      
      // Increment the helped count on the offer if it exists
      if (match.offerId) {
        await this.offersService.incrementHelpedCount(match.offerId);
      }
    }
    
    // Update the match
    Object.assign(match, updateMatchDto);
    
    return await this.matchesRepository.save(match);
  }

  async remove(id: string, userId: string): Promise<void> {
    const match = await this.findOne(id);
    
    // Check if the user has permission to delete this match
    // Only the initiator can delete a match
    if (match.initiatedBy !== userId) {
      throw new ForbiddenException('You do not have permission to delete this match');
    }
    
    await this.matchesRepository.delete(id);
  }


  async findExistingMatch(needId: string, offerId: string): Promise<Match | null> {
    try {
      const match = await this.matchesRepository.findOne({
        where: {
          needId: needId,
          offerId: offerId
        }
      });
      
      return match;
    } catch (error) {
      return null;
    }
  }
}