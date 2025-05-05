import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, Query, HttpStatus, HttpCode 
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, 
  ApiParam, ApiQuery 
} from '@nestjs/swagger';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The offer has been successfully created.' })
  async create(@Body() createOfferDto: CreateOfferDto, @Request() req) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'location', required: false })
  async findAll(@Query() query) {
    return this.offersService.findAll(query);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all offers for the current user' })
  @ApiBearerAuth()
  async findUserOffers(@Request() req) {
    return this.offersService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an offer by id' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an offer' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @Request() req,
  ) {
    return this.offersService.update(id, updateOfferDto, req.user.id);
  }

  @Patch(':id/helped')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Increment the helped count for an offer' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async incrementHelpedCount(@Param('id') id: string) {
    return this.offersService.incrementHelpedCount(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an offer' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.offersService.remove(id, req.user.id);
  }
}