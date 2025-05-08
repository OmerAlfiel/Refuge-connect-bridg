import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Location } from './geolocation.entity';


@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Location, location => location.services, { onDelete: 'CASCADE' })
  location: Location;
}