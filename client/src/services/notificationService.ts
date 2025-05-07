import { api } from '@/lib/api';
import { NotificationType } from '@/types';



export type NotificationQueryParams = {
  type?: NotificationType;
  read?: boolean;
};

export const notificationService = {
  getAllNotifications: async (params?: NotificationQueryParams): Promise<Notification[]> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  
  getNotification: async (id: string): Promise<Notification> => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },
  
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },
  
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch(`/notifications/${id}`, { read: true });
    return response.data;
  },
  
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read/all');
  },
  
  markActionTaken: async (id: string): Promise<Notification> => {
    const response = await api.patch(`/notifications/${id}`, { actionTaken: true });
    return response.data;
  },
  
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};