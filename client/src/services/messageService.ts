import { api } from '@/lib/api';
import { Conversation, CreateConversationRequest, CreateMessageRequest, Message } from '@/types';

export const messageService = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<{ data: Conversation[] }>('/messages/conversations');
    return response.data.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await api.get<{ data: Conversation }>(`/messages/conversations/${id}`);
    return response.data.data;
  },

  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    // Fix: use api instead of apiBaseUrl
    const response = await api.post<{ data: Conversation }>('/messages/conversations', data);
    return response.data.data;
  },

  // Messages
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get<{ data: Message[] }>(`/messages/conversations/${conversationId}/messages`);
    return response.data.data;
  },

  sendMessage: async (data: CreateMessageRequest): Promise<Message> => {
    const response = await api.post<{ data: Message }>('/messages/messages', data);
    return response.data.data;
  },

   markConversationAsRead: async (conversationId: string): Promise<void> => {
    try {
      await api.patch(`/messages/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/messages/unread-count');
    return response.data.count;
  },
};