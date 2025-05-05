import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OfferCategory, OfferStatus } from '../interfaces/offer.enum';


@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: OfferCategory,
    default: OfferCategory.OTHER
  })
  category: OfferCategory;

  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.ACTIVE
  })
  status: OfferStatus;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  availability: {
    startDate?: Date;
    endDate?: Date;
    recurring?: boolean;
    schedule?: string;
  };

  @ManyToOne(() => User, user => user.offers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ default: 0 })
  helpedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}