// Service for subgroup API calls: create, fetch, join, and leave subgroups within a community.
import { api } from './api';
import { SubGroup, CreateSubGroupData } from '../types';

export const subgroupsService = {
  async createSubGroup(data: CreateSubGroupData): Promise<SubGroup> {
    const response = await api.post<SubGroup>('/subgroups', data);
    return response.data;
  },

  async getSubGroups(parentCommunityId: string): Promise<SubGroup[]> {
    const response = await api.get<SubGroup[]>(`/subgroups/community/${parentCommunityId}`);
    return response.data;
  },

  async getSubGroup(id: string): Promise<SubGroup> {
    const response = await api.get<SubGroup>(`/subgroups/${id}`);
    return response.data;
  },

  async joinSubGroup(id: string): Promise<void> {
    await api.post(`/subgroups/${id}/join`);
  },

  async leaveSubGroup(id: string): Promise<void> {
    await api.post(`/subgroups/${id}/leave`);
  },

  async deleteSubGroup(id: string): Promise<void> {
    await api.delete(`/subgroups/${id}`);
  }
};
