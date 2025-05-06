import { Injectable, NotFoundException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(MatchesService.name);

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
        this.logger.log(`Found need: ${need.id}, category: ${need.category}, status: ${need.status}`);
      }
      
      if (offerId) {
        offer = await this.offersService.findOne(offerId);
        this.logger.log(`Found offer: ${offer.id}, category: ${offer.category}, status: ${offer.status}`);
      }
      
      // At least one of need or offer should be defined
      if (!need && !offer) {
        throw new ConflictException('Either need or offer must be provided');
      }
      
      return { need, offer };
    } catch (error) {
      this.logger.error(`Failed to validate match entities: ${error.message}`);
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
      
      this.logger.debug(`Comparing categories: "${normalizedNeedCategory}" vs "${normalizedOfferCategory}"`);
      
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
      this.logger.error(`Error comparing categories: ${error.message}`);
      return false;
    }
  }
  
  async create(createMatchDto: CreateMatchDto, userId: string): Promise<Match> {
    this.logger.log(`Creating match: ${JSON.stringify(createMatchDto)} by user ${userId}`);
    
    try {
      // Validate need and offer existence
      const { need, offer } = await this.validateMatchEntities(
        createMatchDto.needId, 
        createMatchDto.offerId
      );
      
      // Check for category compatibility if both need and offer are provided
      if (need && offer) {
        this.logger.log(`Validating category compatibility between need ${need.id} (${need.category}) and offer ${offer.id} (${offer.category})`);
        
        if (need.status !== NeedStatus.OPEN) {
          this.logger.warn(`Need ${need.id} is not open for matching (status: ${need.status})`);
          throw new ConflictException(`Need is not open for matching (current status: ${need.status})`);
        }
        
        // Check for category compatibility using the improved method
        if (!this.categoriesMatch(need.category, offer.category)) {
          this.logger.warn(`Category mismatch: Need category "${need.category}" doesn't match offer category "${offer.category}"`);
          throw new ConflictException(`Category mismatch: Need category ${need.category} doesn't match offer category ${offer.category}`);
        }
        
        this.logger.log('Categories are compatible');
      }
      
      // Check for existing match if both needId and offerId are provided
      if (createMatchDto.needId && createMatchDto.offerId) {
        this.logger.log(`Checking for existing match between need ${createMatchDto.needId} and offer ${createMatchDto.offerId}`);
        
        const existingMatch = await this.matchesRepository.findOne({
          where: {
            needId: createMatchDto.needId,
            offerId: createMatchDto.offerId,
          },
        });
        
        if (existingMatch) {
          this.logger.warn(`Match already exists with ID ${existingMatch.id}, status: ${existingMatch.status}`);
          throw new ConflictException(`A match already exists for this need and offer (status: ${existingMatch.status})`);
        }
        
        this.logger.log('No existing match found, proceeding with creation');
      }
      
      // Create and save the match
      const match = this.matchesRepository.create({
        ...createMatchDto,
        initiatedBy: userId,
        status: createMatchDto.status || MatchStatus.PENDING
      });
      
      this.logger.log(`Saving match with data: ${JSON.stringify({
        needId: match.needId,
        offerId: match.offerId,
        initiatedBy: match.initiatedBy,
        status: match.status,
        message: match.message?.substring(0, 20) + (match.message?.length > 20 ? '...' : '')
      })}`);
      
      const savedMatch = await this.matchesRepository.save(match);
      this.logger.log(`Match saved successfully with ID: ${savedMatch.id}`);
      
      return savedMatch;
    } catch (error) {
      this.logger.error(`Error creating match: ${error.message}`, error.stack);
      throw error;
    }
  }
  
    async findAll(userId: string, queryDto?: MatchQueryDto): Promise<Match[]> {
      try {
        this.logger.log(`Finding matches for user ${userId}`);
  
        // Debug database state
        const totalMatches = await this.matchesRepository.count();
        this.logger.log(`Total matches in database: ${totalMatches}`);
  
        // Get user's needs and offers
        const userNeeds = await this.needsService.findByUser(userId);
        const userOffers = await this.offersService.findByUser(userId);
  
        this.logger.log(`User has ${userNeeds.length} needs and ${userOffers.length} offers`);
        
        if (userNeeds.length > 0) {
          this.logger.log(`User needs: ${JSON.stringify(userNeeds.map(n => ({
            id: n.id,
            category: n.category,
            status: n.status
          })))}`);
        }
  
        if (userOffers.length > 0) {
          this.logger.log(`User offers: ${JSON.stringify(userOffers.map(o => ({
            id: o.id,
            category: o.category,
            status: o.status
          })))}`);
        }
  
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
        this.logger.log(`Executing SQL: ${sql}`);
        this.logger.log(`With parameters: ${JSON.stringify(params)}`);
  
        // Execute query
        const matches = await queryBuilder.getMany();
        
        this.logger.log(`Found ${matches.length} matches for user ${userId}`);
        
        if (matches.length > 0) {
          this.logger.log(`First match: ${JSON.stringify({
            id: matches[0].id,
            needId: matches[0].needId,
            offerId: matches[0].offerId,
            status: matches[0].status,
            initiatedBy: matches[0].initiatedBy,
            hasNeed: !!matches[0].need,
            hasOffer: !!matches[0].offer
          })}`);
        }
  
        return matches;
      } catch (error) {
        this.logger.error(`Error finding matches for user ${userId}:`, error.stack);
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
      this.logger.error(`Error finding existing match: ${error.message}`, error.stack);
      return null;
    }
  }
}