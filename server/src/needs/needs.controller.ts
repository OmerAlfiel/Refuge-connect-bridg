import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, Query, HttpStatus, HttpCode 
} from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { 
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, 
  ApiParam, ApiQuery, ApiBody 
} from '@nestjs/swagger';
import { NeedStatus } from './interfaces/need-category.enum';

@ApiTags('needs')
@Controller('needs')
export class NeedsController {
  constructor(private readonly needsService: NeedsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new need' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The need has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createNeedDto: CreateNeedDto, @Request() req) {
    return this.needsService.create(createNeedDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all needs' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'urgent', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Return all needs.' })
  async findAll(@Query() query) {
    return this.needsService.findAll(query);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all needs for the current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all needs for the current user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findUserNeeds(@Request() req) {
    return this.needsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a need by id' })
  @ApiParam({ name: 'id', description: 'Need ID' })
  @ApiResponse({ status: 200, description: 'Return the need.' })
  @ApiResponse({ status: 404, description: 'Need not found.' })
  async findOne(@Param('id') id: string) {
    return this.needsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a need' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Need ID' })
  @ApiResponse({ status: 200, description: 'The need has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Need not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateNeedDto: UpdateNeedDto,
    @Request() req,
  ) {
    return this.needsService.update(id, updateNeedDto, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a need status' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Need ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { 
          type: 'string',
          enum: Object.values(NeedStatus)
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The need status has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Need not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: NeedStatus,
  ) {
    return this.needsService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a need' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Need ID' })
  @ApiResponse({ status: 204, description: 'The need has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Need not found.' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.needsService.remove(id, req.user.userId);
  }
}