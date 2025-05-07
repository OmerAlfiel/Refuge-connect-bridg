import { Conversation, CreateConversationRequest } from "@/types";
import { apiBaseUrl } from "../lib/api";


export const conversationService = {
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await apiBaseUrl.post('/messages/conversations', data);
    return response.data;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiBaseUrl.get('/messages/conversations');
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await apiBaseUrl.get(`/messages/conversations/${id}`);
    return response.data;
  }
};