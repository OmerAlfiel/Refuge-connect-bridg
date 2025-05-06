import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, EntitySubscriberInterface, InsertEvent, OneToMany } from 'typeorm';
import { UserRole } from '../interfaces/user-role.enum';
import { Injectable, Logger } from '@nestjs/common';
import { Need } from 'src/needs/entities/need.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Match } from 'src/matches/entities/match.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'role',
    type: 'enum', 
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.REFUGEE
  })
  role: UserRole;

  @Column()
  language: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  contact?: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    country?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships

  @OneToMany(() => Need, need => need.user)
  needs: Need[];

  @OneToMany(() => Offer, offer => offer.user)
  offers: Offer[];

  @OneToMany(() => Match, match => match.initiator)
  initiatedMatches: Match[];

  @OneToMany(() => Match, match => match.responder)
  respondedMatches: Match[];
}

// Add an entity subscriber to debug entity creation
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly logger = new Logger(UserSubscriber.name);
  
  listenTo() {
    return User;
  }
  
  beforeInsert(event: InsertEvent<User>) {
    this.logger.log(`Before inserting user: ${event.entity.email}`);
  }
}