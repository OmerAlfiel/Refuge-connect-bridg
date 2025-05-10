import { api } from '@/lib/api';
import { Conversation, CreateConversationRequest, CreateMessageRequest, Message } from '@/types';

export const messageService = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<{ data: Conversation[] }>('/messages/conversations');
      // Check if response.data exists and has the expected structure
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        // If response.data is directly an array of conversations
        return response.data;
      } else {
        console.error('Unexpected response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },
  getConversation: async (id: string): Promise<Conversation> => {
    try {
      const response = await api.get<{ data: Conversation } | Conversation>(`/messages/conversations/${id}`);
      if (response.data && 'data' in response.data) {
        return response.data.data;
      } else {
        return response.data as Conversation;
      }
    } catch (error) {
      console.error(`Error fetching conversation ${id}:`, error);
      throw error;
    }
  },
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    try {
      const response = await api.post<{ data: Conversation } | Conversation>('/messages/conversations', data);
      if (response.data && 'data' in response.data) {
        return response.data.data;
      } else {
        return response.data as Conversation;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Messages
  getMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const response = await api.get<{ data: Message[] } | Message[]>(`/messages/conversations/${conversationId}/messages`);
      if (response.data && 'data' in response.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('Unexpected response format for messages:', response);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      return [];
    }
  },
  sendMessage: async (data: CreateMessageRequest): Promise<Message> => {
    try {
      const response = await api.post<{ data: Message } | Message>('/messages/messages', data);
      if (response.data && 'data' in response.data) {
        return response.data.data;
      } else {
        return response.data as Message;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
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
    try {
      const response = await api.get<{ count: number } | { data: { count: number } }>('/messages/unread-count');
      if (response.data && 'count' in response.data) {
        return response.data.count;
      } else if (response.data && 'data' in response.data && 'count' in response.data.data) {
        return response.data.data.count;
      } else {
        console.error('Unexpected response format for unread count:', response);
        return 0;
      }
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },
};