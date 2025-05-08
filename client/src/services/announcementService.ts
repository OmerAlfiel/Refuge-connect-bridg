import { api } from '@/lib/api';
import { Announcement, CreateAnnouncementRequest, AnnouncementSubscription } from '@/types';

export const announcementService = {
  getAllAnnouncements: async (params?: { category?: string; region?: string; important?: boolean }): Promise<Announcement[]> => {
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category);
    if (params?.region) queryParams.append('region', params.region);
    if (params?.important !== undefined) queryParams.append('important', String(params.important));
    
    const url = queryParams.toString() ? `/announcements?${queryParams}` : '/announcements';
    const response = await api.get(url);
    return response.data;
  },
  
  getAnnouncement: async (id: string): Promise<Announcement> => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  
  createAnnouncement: async (announcement: CreateAnnouncementRequest): Promise<Announcement> => {
    const response = await api.post('/announcements', announcement);
    return response.data;
  },
  
  updateAnnouncement: async (id: string, announcement: Partial<CreateAnnouncementRequest>): Promise<Announcement> => {
    const response = await api.patch(`/announcements/${id}`, announcement);
    return response.data;
  },
  
  deleteAnnouncement: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  },
  
  subscribeToAnnouncements: async (email: string, preferences: {
    categories?: string[];
    regions?: string[];
  }): Promise<void> => {
    await api.post('/announcements/subscribe', { 
      email, 
      ...preferences 
    });
  },
  
  unsubscribeFromAnnouncements: async (email: string): Promise<void> => {
    await api.delete(`/announcements/unsubscribe/${encodeURIComponent(email)}`);
  }
};