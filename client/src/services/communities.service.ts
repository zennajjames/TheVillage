import { api } from './api';
import { Community, CommunityPost, CreateCommunityData, PlaceSuggestion, JoinRequest } from '../types';

export const communitiesService = {
  // Get all communities with optional category filter
  getAllCommunities: async (filters?: { category?: string }): Promise<Community[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    const queryStr = params.toString();
    const response = await api.get(`/communities${queryStr ? `?${queryStr}` : ''}`);
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

  // Request to join a community
  joinCommunity: async (id: string, message?: string): Promise<{ joinRequest: JoinRequest }> => {
    const response = await api.post(`/communities/${id}/join`, { message });
    return response.data;
  },

  // Get pending join requests for a community (admin only)
  getJoinRequests: async (communityId: string): Promise<JoinRequest[]> => {
    const response = await api.get(`/communities/${communityId}/join-requests`);
    return response.data;
  },

  // Respond to a join request (admin only)
  respondToJoinRequest: async (communityId: string, requestId: string, status: 'APPROVED' | 'DENIED'): Promise<void> => {
    await api.patch(`/communities/${communityId}/join-requests/${requestId}`, { status });
  },

  // Cancel own pending join request
  cancelJoinRequest: async (communityId: string): Promise<void> => {
    await api.delete(`/communities/${communityId}/join-request`);
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

  // Create a post within a community
  createCommunityPost: async (communityId: string, content: string): Promise<CommunityPost> => {
    const response = await api.post(`/communities/${communityId}/posts`, { content });
    return response.data;
  },

  // Search for local community places via Google Places when no communities exist
  searchLocalPlaces: async (zipCode: string, searchType?: 'school' | 'neighborhood'): Promise<PlaceSuggestion[]> => {
    const params = new URLSearchParams({ zipCode });
    if (searchType) params.append('searchType', searchType);
    const response = await api.get(`/places/local-communities?${params.toString()}`);
    return response.data;
  },
};
