import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createConversation(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    // Check if participants exist
    const allParticipantIds = [userId, ...createConversationDto.participantIds];
    const participants = await this.userRepository.findByIds(allParticipantIds);

    if (participants.length !== allParticipantIds.length) {
      throw new NotFoundException('One or more participants not found');
    }

    // Check if conversation between these users already exists
    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant')
      .where('participant.id IN (:...participantIds)', { 
        participantIds: allParticipantIds 
      })
      .groupBy('conversation.id')
      .having('COUNT(DISTINCT participant.id) = :count', { 
        count: allParticipantIds.length 
      })
      .getOne();

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = this.conversationRepository.create({
      participants,
    });

    const savedConversation = await this.conversationRepository.save(conversation);

    // Add initial message if provided
    if (createConversationDto.initialMessage) {
      await this.createMessage(
        userId,
        {
          conversationId: savedConversation.id,
          content: createConversationDto.initialMessage,
        },
      );
    }

    return this.getConversationById(savedConversation.id, userId);
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    // Remove profile relation which doesn't exist
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.participants', 'allParticipants')
      .where('participant.id = :userId', { userId })
      .orderBy('conversation.lastMessageAt', 'DESC', 'NULLS LAST')
      .getMany();
  }

  async getConversationById(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    // Remove profile relation which doesn't exist
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.participants', 'allParticipants')
      .where('conversation.id = :conversationId', { conversationId })
      .andWhere('participant.id = :userId', { userId })
      .getOne();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    // Check if user is participant
    await this.getConversationById(conversationId, userId);

    // Remove profile relation which doesn't exist
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.conversationId = :conversationId', { conversationId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async createMessage(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    // Verify user is participant
    await this.getConversationById(createMessageDto.conversationId, userId);
  
    // Find the user
    const sender = await this.userRepository.findOne({ where: { id: userId } });
    if (!sender) {
      throw new NotFoundException('User not found');
    }
  
    // Create message with proper sender reference
    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender,
      senderId: userId,
      conversationId: createMessageDto.conversationId,
      timestamp: new Date(),
      read: false
    });
  
    const savedMessage = await this.messageRepository.save(message);
    
    // Update conversation with last message
    await this.conversationRepository.update(
      createMessageDto.conversationId,
      {
        lastMessage: createMessageDto.content,
        lastMessageAt: new Date(),
      }
    );
    
    return savedMessage;
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ read: true })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .execute();
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.conversation', 'conversation')
      .innerJoin('conversation.participants', 'participant')
      .where('participant.id = :userId', { userId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.read = :read', { read: false })
      .getCount();
    
    return result;
  }
}