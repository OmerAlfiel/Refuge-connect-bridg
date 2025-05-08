import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  hours?: string;
}