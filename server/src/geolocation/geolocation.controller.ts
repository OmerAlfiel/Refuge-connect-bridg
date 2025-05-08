import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { QueryLocationsDto } from './dto/query-locations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLocationDto } from './dto/create-geolocation.dto';
import { UpdateLocationDto } from './dto/update-geolocation.dto';
import { UserRole } from 'src/users/interfaces/user-role.enum';

@Controller('locations')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NGO)
  create(@Body() createLocationDto: CreateLocationDto, @Request() req) {
    return this.geolocationService.create(createLocationDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryLocationsDto) {
    return this.geolocationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geolocationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NGO)
  update(
    @Param('id') id: string, 
    @Body() updateLocationDto: UpdateLocationDto,
    @Request() req
  ) {
    return this.geolocationService.update(id, updateLocationDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.geolocationService.remove(id);
  }
}