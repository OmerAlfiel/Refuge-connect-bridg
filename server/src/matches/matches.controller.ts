import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
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
  private readonly logger = new Logger(MatchesController.name)
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
      this.logger.log("Creating match with data:", JSON.stringify(createMatchDto));
      
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
      
      return result;
    } catch (error) {
      this.logger.error("Error creating match:", error);
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
    return this.matchesService.findAll(req.user.id, query);
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
}