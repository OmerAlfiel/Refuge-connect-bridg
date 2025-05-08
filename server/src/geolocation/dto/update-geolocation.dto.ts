import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-geolocation.dto';


export class UpdateLocationDto extends PartialType(CreateLocationDto) {}