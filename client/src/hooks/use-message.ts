import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';
import { useEffect } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';

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

// Get messages for a specific conversation
export function useConversationMessages(conversationId?: string) {
  const queryClient = useQueryClient();
  const { socket, markConversationAsRead } = useWebSocket();

  // Fetch messages
  const result = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.getMessages(conversationId!),
    enabled: !!conversationId,
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!conversationId || result.isLoading) return;

    const markAsRead = async () => {
      try {
        await messageService.markConversationAsRead(conversationId);
        markConversationAsRead(conversationId);
        
        // Update unread count
        queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    };

    markAsRead();
  }, [conversationId, result.isLoading, markConversationAsRead, queryClient]);

  // Listen for new messages in this conversation
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (data: { message: { conversationId: string } }) => {
      if (data.message.conversationId === conversationId) {
        // Update messages in this conversation
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        
        // Mark the message as read since we're viewing the conversation
        markConversationAsRead(conversationId);
      }
    };

    socket.on('newMessage', handleNewMessage);
    
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId, queryClient, markConversationAsRead]);

  return result;
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