import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Need } from '../../needs/entities/need.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { MatchStatus } from '../interfaces/match.enum';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  needId: string | null;

  @Column({ nullable: true })
  offerId: string | null;

  @Column()
  initiatedBy: string;

  @Column({ nullable: true })
  respondedBy: string;

  @Column({ nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING
  })
  status: MatchStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiatedBy' })
  initiator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'respondedBy' })
  responder: User;

  @ManyToOne(() => Need, { nullable: true })
  @JoinColumn({ name: 'needId' })
  need: Need;

  @ManyToOne(() => Offer, { nullable: true })
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}