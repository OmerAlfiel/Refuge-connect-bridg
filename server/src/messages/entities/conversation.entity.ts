import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable, AfterLoad } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'conversation_participants',
    joinColumn: { name: 'conversationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  participants: User[];

  @OneToMany(() => Message, message => message.conversation, { cascade: true })
  messages: Message[];

  @Column({ nullable: true })
  lastMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for tracking unread messages
  hasUnread?: boolean;

  @AfterLoad()
  computeUnreadStatus() {
    // This will be populated by the service
    this.hasUnread = this.messages?.some(message => !message.read) || false;
  }
}