import { api } from '@/lib/api';
import { Conversation, CreateConversationRequest, CreateMessageRequest, Message } from '@/types';

export const messageService = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await api.get(`/messages/conversations/${id}`);
    return response.data;
  },

  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    // Fix: use api instead of apiBaseUrl
    const response = await api.post('/messages/conversations', data);
    return response.data;
  },

  // Messages
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get(`/messages/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (data: CreateMessageRequest): Promise<Message> => {
    const response = await api.post('/messages/messages', data);
    return response.data;
  },

  markConversationAsRead: async (conversationId: string): Promise<void> => {
    const token = localStorage.getItem('auth_token'); // Or however you store your auth token
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`http://localhost:3000/messages/conversations/${conversationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark conversation as read: ${response.statusText}`);
    }
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/messages/unread-count');
    return response.data.count;
  },
};