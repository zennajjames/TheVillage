// Service for help request API calls: create, fetch by community, and admin status updates.
import { api } from './api';
import { HelpRequest, CreateHelpRequestData } from '../types';

export const helpRequestsService = {
  async create(data: CreateHelpRequestData): Promise<HelpRequest> {
    const response = await api.post<HelpRequest>('/help-requests', data);
    return response.data;
  },

  async getCommunityRequests(communityId: string, status?: string): Promise<HelpRequest[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const response = await api.get<HelpRequest[]>(`/help-requests/community/${communityId}?${params.toString()}`);
    return response.data;
  },

  async getAdminInbox(communityId: string): Promise<HelpRequest[]> {
    const response = await api.get<HelpRequest[]>(`/help-requests/admin/${communityId}`);
    return response.data;
  },

  async getById(id: string): Promise<HelpRequest> {
    const response = await api.get<HelpRequest>(`/help-requests/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<HelpRequest> {
    const response = await api.patch<HelpRequest>(`/help-requests/${id}/status`, { status });
    return response.data;
  },

  async createProxy(id: string, description?: string): Promise<HelpRequest> {
    const response = await api.post<HelpRequest>(`/help-requests/${id}/proxy`, { description });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/help-requests/${id}`);
  },
};
