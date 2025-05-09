import { Conversation, CreateConversationRequest } from "@/types";
import { api } from "../lib/api"; 

export const conversationService = {
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await api.post<Conversation>('/messages/conversations', data);
    return response.data;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/messages/conversations');
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/messages/conversations/${id}`);
    return response.data;
  }
};