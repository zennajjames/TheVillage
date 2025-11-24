import { api } from './api';
import { User } from '../types';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  location?: string;
  zipCode?: string;
  bio?: string;
  profilePicture?: string;
}

export interface UserProfile extends User {
  createdAt: string;
  posts?: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

export const userService = {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/auth/profile/${userId}`);
    return response.data;
  }
};