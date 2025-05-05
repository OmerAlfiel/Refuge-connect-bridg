import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NeedCategory, NeedStatus } from '../interfaces/need-category.enum';


@Entity('needs')
export class Need {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: NeedCategory,
    default: NeedCategory.OTHER
  })
  category: NeedCategory;

  @Column({ default: false })
  urgent: boolean;

  @Column({
    type: 'enum',
    enum: NeedStatus,
    default: NeedStatus.OPEN
  })
  status: NeedStatus;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };

  @ManyToOne(() => User, user => user.needs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}