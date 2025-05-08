import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  category: string;

  @Column()
  region: string;

  @Column({ default: false })
  important: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  eventDate: Date | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'postedById' })
  postedBy: User;

  @Column()
  postedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}