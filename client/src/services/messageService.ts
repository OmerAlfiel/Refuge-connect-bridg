
import { apiBaseUrl } from '@/lib/api';
import { Conversation, CreateConversationRequest, CreateMessageRequest, Message } from '@/types';


export const messageService = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiBaseUrl.get('/messages/conversations');
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await apiBaseUrl.get(`/messages/conversations/${id}`);
    return response.data;
  },

  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await apiBaseUrl.post('/messages/conversations', data);
    return response.data;
  },

  // Messages
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await apiBaseUrl.get(`/messages/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (data: CreateMessageRequest): Promise<Message> => {
    const response = await apiBaseUrl.post('/messages/messages', data);
    return response.data;
  },

  markConversationAsRead: async (conversationId: string): Promise<void> => {
    await apiBaseUrl.patch(`/messages/conversations/${conversationId}/read`);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiBaseUrl.get('/messages/unread-count');
    return response.data.count;
  },
};