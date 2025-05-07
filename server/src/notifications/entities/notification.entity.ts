import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  MATCH = 'match',
  MESSAGE = 'message',
  SYSTEM = 'system',
  OFFER = 'offer',
  ANNOUNCEMENT = 'announcement',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @ManyToOne(() => User, { nullable: false })
  @Index()
  recipient: User;

  @Column({ nullable: false })
  recipientId: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  actionTaken: boolean;

  @CreateDateColumn()
  createdAt: Date;
}