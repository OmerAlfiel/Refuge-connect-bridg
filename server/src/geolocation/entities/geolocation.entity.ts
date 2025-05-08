import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Service } from './service.entity';
import { ContactInfo } from './contact-info.entity';


export type LocationType = 'resource' | 'medical' | 'housing' | 'legal' | 'education' | 'employment';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['resource', 'medical', 'housing', 'legal', 'education', 'employment'],
    default: 'resource'
  })
  type: LocationType;

  @Column()
  address: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column('text')
  description: string;

  @OneToMany(() => Service, service => service.location, { cascade: true, eager: true })
  services: Service[];

  @OneToOne(() => ContactInfo, { cascade: true, nullable: true, eager: true })
  @JoinColumn()
  contactInfo?: ContactInfo;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;
}