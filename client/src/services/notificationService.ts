import { api } from '@/lib/api';
import { Notification, NotificationType } from '@/types';



export type NotificationQueryParams = {
  type?: NotificationType;
  read?: boolean;
};

export const notificationService = {  getAllNotifications: async (params?: NotificationQueryParams): Promise<Notification[]> => {
    console.log('Fetching notifications with params:', params);
    try {
      const response = await api.get<{ data: Notification[] }>('/notifications', { params });
      console.log('Notifications response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  getNotification: async (id: string): Promise<Notification> => {
    const response = await api.get<{ data: Notification }>(`/notifications/${id}`);
    return response.data.data;
  },
  
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ data: { count: number } }>('/notifications/unread-count');
    return response.data.data.count;
  },
  
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<{ data: Notification }>(`/notifications/${id}`, { read: true });
    return response.data.data;
  },
  
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read/all');
  },
  
  markActionTaken: async (id: string): Promise<Notification> => {
    const response = await api.patch<{ data: Notification }>(`/notifications/${id}`, { actionTaken: true });
    return response.data.data;
  },
  
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};