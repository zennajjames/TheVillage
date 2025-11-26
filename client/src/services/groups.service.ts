import { api } from './api';
import { Group, CreateGroupData, GroupPost } from '../types';

export const groupsService = {
  async createGroup(data: CreateGroupData): Promise<Group> {
    const response = await api.post<Group>('/groups', data);
    return response.data;
  },

  async getGroups(category?: string, location?: string): Promise<Group[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    
    const response = await api.get<Group[]>(`/groups?${params.toString()}`);
    return response.data;
  },

  async getGroup(id: string): Promise<Group> {
    const response = await api.get<Group>(`/groups/${id}`);
    return response.data;
  },

  async joinGroup(id: string): Promise<void> {
    await api.post(`/groups/${id}/join`);
  },

  async leaveGroup(id: string): Promise<void> {
    await api.post(`/groups/${id}/leave`);
  },

  async createGroupPost(groupId: string, content: string): Promise<GroupPost> {
    const response = await api.post<GroupPost>(`/groups/${groupId}/posts`, { content });
    return response.data;
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  }
};