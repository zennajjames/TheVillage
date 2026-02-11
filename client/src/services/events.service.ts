import { api } from './api';
import { Event, CreateEventData } from '../types';

interface GetEventsParams {
  startDate?: string;
  endDate?: string;
  communityId?: string;
}

export const eventsService = {
  async getEvents(params?: GetEventsParams): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.set('startDate', params.startDate);
    if (params?.endDate) queryParams.set('endDate', params.endDate);
    if (params?.communityId) queryParams.set('communityId', params.communityId);

    const queryString = queryParams.toString();
    const url = queryString ? `/events?${queryString}` : '/events';
    const response = await api.get<Event[]>(url);
    return response.data;
  },

  async getEventById(id: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  async getMyEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/mine');
    return response.data;
  },

  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await api.post<Event>('/events', data);
    return response.data;
  },

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await api.patch<Event>(`/events/${id}`, data);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
