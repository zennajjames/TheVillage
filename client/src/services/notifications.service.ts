import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationsAPI = {
  getNotifications: async (limit?: number) => {
    const response = await api.get('/notifications', { params: { limit } });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  deleteAllRead: async () => {
    const response = await api.delete('/notifications/read/all');
    return response.data;
  }
};

// Add these to authAPI:
export const authAPI = {
  // ... existing methods ...

  sendPhoneVerification: async (phoneNumber: string) => {
    const response = await api.post('/auth/send-phone-verification', { phoneNumber });
    return response.data;
  },

  verifyPhone: async (phoneNumber: string, code: string) => {
    const response = await api.post('/auth/verify-phone', { phoneNumber, code });
    return response.data;
  },
};
