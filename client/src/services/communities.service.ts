import { api } from './api';
import { Community, CreateCommunityData } from '../types';

export const communitiesService = {
  // Get all communities
  getAllCommunities: async (): Promise<Community[]> => {
    const response = await api.get('/communities');
    return response.data;
  },

  // Get communities user is a member of
  getUserCommunities: async (): Promise<Community[]> => {
    const response = await api.get('/communities/my-communities');
    return response.data;
  },

  // Get single community by ID
  getCommunityById: async (id: string): Promise<Community> => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },

  // Create a new community
  createCommunity: async (data: CreateCommunityData): Promise<Community> => {
    const response = await api.post('/communities', data);
    return response.data;
  },

  // Update a community
  updateCommunity: async (id: string, data: Partial<CreateCommunityData>): Promise<Community> => {
    const response = await api.put(`/communities/${id}`, data);
    return response.data;
  },

  // Delete a community
  deleteCommunity: async (id: string): Promise<void> => {
    await api.delete(`/communities/${id}`);
  },

  // Join a community
  joinCommunity: async (id: string): Promise<void> => {
    await api.post(`/communities/${id}/join`);
  },

  // Leave a community
  leaveCommunity: async (id: string): Promise<void> => {
    await api.post(`/communities/${id}/leave`);
  },

  // Update member role
  updateMemberRole: async (communityId: string, memberId: string, role: 'ADMIN' | 'MODERATOR' | 'MEMBER'): Promise<void> => {
    await api.put(`/communities/${communityId}/members/${memberId}/role`, { role });
  },

  // Remove member from community
  removeMember: async (communityId: string, memberId: string): Promise<void> => {
    await api.delete(`/communities/${communityId}/members/${memberId}`);
  },
};
