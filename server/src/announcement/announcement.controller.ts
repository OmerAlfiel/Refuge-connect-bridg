import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementSubscriptionDto } from './dto/announcement-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnnouncementsService } from './announcement.service';
import { UserRole } from 'src/users/interfaces/user-role.enum';

@ApiTags('announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NGO) // Use enum values instead of string literals
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new announcement (Admin/NGO only)' })
  @ApiResponse({ status: 201, description: 'Announcement successfully created.' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Request() req) {
    return this.announcementsService.create(createAnnouncementDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all announcements' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'important', required: false, type: Boolean })
  findAll(@Query('category') category?: string, @Query('region') region?: string, @Query('important') important?: boolean) {
    return this.announcementsService.findAll({ category, region, important: important === true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific announcement by ID' })
  @ApiResponse({ status: 200, description: 'Return the announcement.' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NGO) // Use enum values here too
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an announcement (Admin/NGO only)' })
  @ApiResponse({ status: 200, description: 'Announcement successfully updated.' })
  update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto, @Request() req) {
    return this.announcementsService.update(id, updateAnnouncementDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NGO) // And here as well
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an announcement (Admin/NGO only)' })
  @ApiResponse({ status: 204, description: 'Announcement successfully deleted.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.announcementsService.remove(id, req.user);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to announcements' })
  @ApiResponse({ status: 201, description: 'Successfully subscribed to announcements.' })
  subscribe(@Body() subscriptionDto: AnnouncementSubscriptionDto) {
    return this.announcementsService.subscribe(subscriptionDto);
  }

  @Delete('unsubscribe/:email')
  @ApiOperation({ summary: 'Unsubscribe from announcements' })
  @ApiResponse({ status: 204, description: 'Successfully unsubscribed from announcements.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  unsubscribe(@Param('email') email: string) {
    return this.announcementsService.unsubscribe(email);
  }
}