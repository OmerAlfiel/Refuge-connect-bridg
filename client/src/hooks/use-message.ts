import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';
import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import { useAuth } from '@/context/AuthContext';

// Get all conversations
export function useConversations() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  // Listen for new messages to update conversation list
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("Setting up newMessage listener for conversation list");
    
    const handleNewMessage = (data: { message: { conversationId: string } }) => {
      console.log("New message received, updating conversations", data);
      // Invalidate conversations query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      // Update unread count
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    socket.on('newMessage', handleNewMessage);
    
    return () => {
      console.log("Removing newMessage listener for conversation list");
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, isConnected, queryClient]);

  return useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    meta: {
      onError: (err) => console.error("Error fetching conversations:", err)
    }
  });
}


export function useConversationMessages(conversationId?: string) {
  const queryClient = useQueryClient();
  const prevConversationIdRef = useRef<string | undefined>(undefined);
  const { token } = useAuth();

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!conversationId || !token || conversationId === prevConversationIdRef.current) return;
    
    prevConversationIdRef.current = conversationId;
    
    console.log("Marking conversation as read:", conversationId);
    messageService.markConversationAsRead(conversationId)
      .then(() => {
        console.log("Successfully marked conversation as read");
        // Update all related queries to reflect read status
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      })
      .catch(error => {
        console.error('Failed to mark conversation as read:', error);
      });
  }, [conversationId, queryClient, token]); // Add token to dependencies
  // Fetch messages
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.getMessages(conversationId!),
    enabled: !!conversationId,
  });
}
// Send a message
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { sendMessage } = useWebSocket();
  
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      // Try WebSocket first
      try {
        const result = await sendMessage(conversationId, content);
        if (result) return result;
      } catch (error) {
        console.error('WebSocket send failed, falling back to HTTP', error);
      }
      
      // Fall back to HTTP if WebSocket fails
      return messageService.sendMessage({ conversationId, content });
    },
    onSuccess: (data) => {
      // Update the messages in this conversation
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
      
      // Update the conversation list to show latest message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Create a new conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.createConversation,
    onSuccess: (data) => {
      // Update conversations list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      return data;
    },
  });
}

// Get unread message count
export function useUnreadCount() {
  const { socket } = useWebSocket();
  const queryClient = useQueryClient();

  // Listen for new messages to update unread count
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    const handleMessagesRead = () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);
    
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: messageService.getUnreadCount,
    refetchInterval: 300000, // Refetch every 5 minutes as fallback
  });
}