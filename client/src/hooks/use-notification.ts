import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationQueryParams } from '@/services/notificationService';
import { useEffect } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';

export function useNotifications(params?: NotificationQueryParams) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  // Listen for new notifications to update the list
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    const handleNotificationsRead = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('notificationsRead', handleNotificationsRead);
    
    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('notificationsRead', handleNotificationsRead);
    };
  }, [socket, isConnected, queryClient]);

  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getAllNotifications(params),
  });
}

export function useNotification(id?: string) {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getNotification(id!),
    enabled: !!id,
  });
}

export function useUnreadNotificationCount() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  // Listen for events that would affect the unread count
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    const handleNotificationsRead = () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('notificationsRead', handleNotificationsRead);
    
    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('notificationsRead', handleNotificationsRead);
    };
  }, [socket, isConnected, queryClient]);

  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}

export function useMarkNotificationActionTaken() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markActionTaken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
}