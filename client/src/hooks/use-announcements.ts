import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '@/services/announcementService';
import { Announcement, CreateAnnouncementRequest } from '@/types';
import { useEffect } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';

export function useAnnouncements(params?: {
  category?: string;
  region?: string;
  important?: boolean;
}) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  // Listen for new announcement events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewAnnouncement = () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    };

    socket.on('newAnnouncement', handleNewAnnouncement);
    
    return () => {
      socket.off('newAnnouncement', handleNewAnnouncement);
    };
  }, [socket, isConnected, queryClient]);

  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementService.getAllAnnouncements(params),
  });
}

export function useAnnouncement(id?: string) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementService.getAnnouncement(id!),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (announcement: CreateAnnouncementRequest) => 
      announcementService.createAnnouncement(announcement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, announcement }: { id: string, announcement: Partial<CreateAnnouncementRequest> }) => 
      announcementService.updateAnnouncement(id, announcement),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: announcementService.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useSubscribeToAnnouncements() {
  return useMutation({
    mutationFn: (subscription: { email: string, categories?: string[], regions?: string[] }) => 
      announcementService.subscribeToAnnouncements(subscription.email, {
        categories: subscription.categories,
        regions: subscription.regions,
      }),
  });
}

export function useUnsubscribeFromAnnouncements() {
  return useMutation({
    mutationFn: (email: string) => 
      announcementService.unsubscribeFromAnnouncements(email),
  });
}