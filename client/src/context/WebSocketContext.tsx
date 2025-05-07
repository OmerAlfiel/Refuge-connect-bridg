import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message } from '@/types';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (conversationId: string, content: string) => Promise<Message | null>;
  markConversationAsRead: (conversationId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => Promise.resolve(null),
  markConversationAsRead: () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();
  
  // Initialize socket connection when authenticated
  useEffect(() => {
    if (!token || !user?.id) {
      console.log("WebSocket not connecting - user not authenticated");
      return;
    }

    console.log(`Attempting to establish WebSocket connection for user ${user.id}...`);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const newSocket = io(apiUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    newSocket.on('connect', () => {
      console.log(`WebSocket connected with ID: ${newSocket.id}`);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error(`WebSocket connection error: ${error.message}`);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, [token, user?.id]);
  
  // Send message via WebSocket
  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<Message | null> => {
      if (!socket || !isConnected) {
        console.error('WebSocket not connected for sending message');
        return null;
      }

      console.log(`Sending message to conversation: ${conversationId}`);
      return new Promise((resolve, reject) => {
        socket.emit(
          'sendMessage',
          { conversationId, content },
          (response: { error?: string; id?: string } | Message) => {
            if ('error' in response) {
              console.error('Error sending message:', response.error);
              reject(new Error(response.error));
            } else {
              console.log('Message sent successfully:', response);
              resolve(response as Message);
            }
          },
        );
      });
    },
    [socket, isConnected],
  );

  // Mark conversation as read
  const markConversationAsRead = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) {
        console.warn('WebSocket not connected for marking read');
        return;
      }
      
      console.log(`Marking conversation as read: ${conversationId}`);
      socket.emit('markAsRead', { conversationId });
    },
    [socket, isConnected],
  );

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, sendMessage, markConversationAsRead }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);