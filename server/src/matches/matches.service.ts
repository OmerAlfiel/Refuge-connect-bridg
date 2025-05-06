import { Injectable, NotFoundException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      this.logger.error(`Failed to validate match entities: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Failed to validate match entities');
    }
  }
  
  // Then update the create method
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
        this.logger.log(`Validated entities - Need: ${need.id} (${need.status}), Offer: ${offer.id} (${offer.category})`);
        
        if (need.status !== NeedStatus.OPEN) {
          this.logger.warn(`Need ${need.id} is not open for matching (status: ${need.status})`);
          throw new ConflictException(`Need is not open for matching (current status: ${need.status})`);
        }
        
        // Check for category compatibility
        const needCategory = String(need.category).toLowerCase();
        const offerCategory = String(offer.category).toLowerCase();
  
        this.logger.log(`Comparing categories - Need: "${needCategory}", Offer: "${offerCategory}"`);
        
        // Direct match or special case for shelter/housing equivalence
        const isMatch = 
          needCategory === offerCategory ||
          (needCategory === 'shelter' && offerCategory === 'housing') || 
          (needCategory === 'housing' && offerCategory === 'shelter');
      
        if (!isMatch) {
          this.logger.warn(`Category mismatch: Need category "${needCategory}" doesn't match offer category "${offerCategory}"`);
          throw new ConflictException(`Category mismatch: Need category ${needCategory} doesn't match offer category ${offerCategory}`);
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
          this.logger.warn(`Match already exists between need ${createMatchDto.needId} and offer ${createMatchDto.offerId} with status ${existingMatch.status}`);
          throw new ConflictException(`A match already exists for this need and offer (status: ${existingMatch.status})`);
        }
      }
      
      // Create and save the match
      const match = this.matchesRepository.create({
        ...createMatchDto,
        initiatedBy: userId,
      });
      
      this.logger.log(`About to save match: ${JSON.stringify({
        needId: match.needId,
        offerId: match.offerId,
        initiatedBy: match.initiatedBy,
        status: match.status
      })}`);
      
      return await this.matchesRepository.save(match);
      
    } catch (error) {
      this.logger.error(`Error creating match: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(userId: string, queryDto?: MatchQueryDto): Promise<Match[]> {
    const queryBuilder = this.matchesRepository.createQueryBuilder('match')
      .leftJoinAndSelect('match.need', 'need')
      .leftJoinAndSelect('match.offer', 'offer')
      .leftJoinAndSelect('need.user', 'needUser')
      .leftJoinAndSelect('offer.user', 'offerUser')
      .where('(need.userId = :userId OR offer.userId = :userId OR match.initiatedBy = :userId OR match.respondedBy = :userId)', 
        { userId });
    
    // Apply filters if provided
    if (queryDto) {
      if (queryDto.status) {
        queryBuilder.andWhere('match.status = :status', { status: queryDto.status });
      }
      
      if (queryDto.needId) {
        queryBuilder.andWhere('match.needId = :needId', { needId: queryDto.needId });
      }
      
      if (queryDto.offerId) {
        queryBuilder.andWhere('match.offerId = :offerId', { offerId: queryDto.offerId });
      }
    }
    
    // Order by creation date, newest first
    queryBuilder.orderBy('match.createdAt', 'DESC');
    
    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['need', 'offer', 'need.user', 'offer.user'],
    });
    
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto, userId: string): Promise<Match> {
    const match = await this.findOne(id);
    
    // Check if the user has permission to update this match
    // Either they own the need, offer, or they initiated the match
    const need = match.need;
    const offer = match.offer;
    
    if (need.userId !== userId && offer.userId !== userId && match.initiatedBy !== userId) {
      throw new ForbiddenException('You do not have permission to update this match');
    }
    
    // If the match is being accepted or rejected, record who responded
    if ((updateMatchDto.status === MatchStatus.ACCEPTED || updateMatchDto.status === MatchStatus.REJECTED) 
        && match.status === MatchStatus.PENDING) {
      match.respondedBy = userId;
    }
    
    // If the match is being accepted, update the need status
    if (updateMatchDto.status === MatchStatus.ACCEPTED && match.status === MatchStatus.PENDING) {
      await this.needsService.update(match.needId, { status: NeedStatus.MATCHED }, userId);
    }
    
    // If the match is being completed, update the need status
    if (updateMatchDto.status === MatchStatus.COMPLETED && match.status === MatchStatus.ACCEPTED) {
      await this.needsService.update(match.needId, { status: NeedStatus.FULFILLED }, userId);
      
      // Increment the helped count on the offer
      await this.offersService.incrementHelpedCount(match.offerId);
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
}