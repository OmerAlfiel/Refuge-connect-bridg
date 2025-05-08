import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AnnouncementSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column('simple-array', { nullable: true })
  categories: string[];

  @Column('simple-array', { nullable: true })
  regions: string[];

  @CreateDateColumn()
  createdAt: Date;
}