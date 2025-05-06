import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, HttpCode, HttpStatus, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchQueryDto } from './dto/match-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NeedsService } from 'src/needs/needs.service';
import { OffersService } from 'src/offers/offers.service';
import { MatchStatus } from './interfaces/match.enum';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  private readonly logger = new Logger(MatchesController.name);
  
  constructor(
    private readonly matchesService: MatchesService,
    private readonly needsService: NeedsService,
    private readonly offersService: OffersService,
  ) {}



@Post()
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Create a new match' })
@ApiBearerAuth()
@ApiResponse({ status: 201, description: 'The match has been successfully created.' })
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 409, description: 'Conflict - match already exists or need is not open.' })
async create(@Body() createMatchDto: CreateMatchDto, @Request() req) {
  try {
    this.logger.log(`Creating match request from user ${req.user.id}. Data: ${JSON.stringify(createMatchDto)}`);
    
    // Validate that at least one of needId or offerId is provided
    if (!createMatchDto.needId && !createMatchDto.offerId) {
      throw new BadRequestException('At least one of needId or offerId must be provided');
    }
    
    // Add user ID from JWT token
    const userId = req.user.id || req.user.sub;
    
    // Set default status if not provided
    const matchData: CreateMatchDto = {
      ...createMatchDto,
      status: createMatchDto.status || MatchStatus.PENDING,
      initiatedBy: userId
    };
    
    // Pass both the DTO and userId to the service
    const result = await this.matchesService.create(matchData, userId);
    this.logger.log(`Match created successfully with ID: ${result.id}`);
    
    return result;
  } catch (error) {
    this.logger.error(`Error creating match: ${error.message}`, error.stack);
    throw error;
  }
}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all matches for the current user' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'accepted', 'rejected', 'completed'] })
  @ApiQuery({ name: 'needId', required: false })
  @ApiQuery({ name: 'offerId', required: false })
  async findAll(@Query() query: MatchQueryDto, @Request() req) {
    try {
      const userId = req.user.id;
      this.logger.log(`Finding matches for user ${userId} with query: ${JSON.stringify(query)}`);
      
      // First check if user has any needs or offers
      try {
        const userNeeds = await this.needsService.findByUser(userId);
        this.logger.log(`User has ${userNeeds.length} needs`);
        
        if (userNeeds.length > 0) {
          this.logger.log(`User need categories: ${userNeeds.map(n => n.category).join(', ')}`);
        }
        
        const userOffers = await this.offersService.findByUser(userId);
        this.logger.log(`User has ${userOffers.length} offers`);
        
        if (userOffers.length > 0) {
          this.logger.log(`User offer categories: ${userOffers.map(o => o.category).join(', ')}`);
        }
        
        // Log the parameters we'll be using
        this.logger.log(`User ID: ${userId}`);
        
      } catch (e) {
        this.logger.error(`Error getting user needs/offers: ${e.message}`);
      }
      
      // Call the service method to find matches
      const matches = await this.matchesService.findAll(userId, query);
      
      this.logger.log(`Returning ${matches.length} matches to client`);
      if (matches.length > 0) {
        this.logger.log(`First match: ${JSON.stringify({
          id: matches[0].id,
          needId: matches[0].needId,
          offerId: matches[0].offerId,
          status: matches[0].status,
          initiatedBy: matches[0].initiatedBy,
          respondedBy: matches[0].respondedBy || 'none'
        })}`);
      }
      
      return matches;
    } catch (error) {
      this.logger.error(`Error finding matches: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a match by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({ status: 200, description: 'Return the match.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a match' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({ status: 200, description: 'The match has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  async update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto, @Request() req) {
    return this.matchesService.update(id, updateMatchDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a match' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({ status: 204, description: 'The match has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.matchesService.remove(id, req.user.id);
  }

    @Post('create-match-between')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a match between specific need and offer' })
    @ApiBearerAuth()
    async createMatchBetween(
      @Body() body: { needId: string; offerId: string; message?: string },
      @Request() req
    ) {
      try {
        const userId = req.user.id;
        this.logger.log(`Creating match between need ${body.needId} and offer ${body.offerId} by user ${userId}`);
        
        // Validate need and offer existence
        const need = await this.needsService.findOne(body.needId);
        const offer = await this.offersService.findOne(body.offerId);
        
        this.logger.log(`Found need: ${need.id} (${need.category}) and offer: ${offer.id} (${offer.category})`);
        
        // Check if match already exists
        // Fix: Use findExistingMatch instead of findOne with query object
        const existingMatch = await this.matchesService.findExistingMatch(body.needId, body.offerId);
        
        if (existingMatch) {
          this.logger.warn(`Match already exists between need ${body.needId} and offer ${body.offerId}`);
          throw new ConflictException('Match already exists between this need and offer');
        }
    
        // Create match
        const match = await this.matchesService.create({
          needId: body.needId,
          offerId: body.offerId,
          message: body.message || 'Match created through helper endpoint',
          status: MatchStatus.PENDING,
          initiatedBy: userId
        }, userId);
    
        this.logger.log(`Match created successfully with ID: ${match.id}`);
        return match;
      } catch (error) {
        this.logger.error(`Error creating match: ${error.message}`, error.stack);
        throw error;
      }
    }
  
}