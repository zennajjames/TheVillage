import { api } from './api';

export interface SearchResults {
  query: string;
  results: {
    users: any[];
    posts: any[];
    groups: any[];
    messages: any[];
  };
  counts: {
    users: number;
    posts: number;
    groups: number;
    messages: number;
    total: number;
  };
}

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    const response = await api.get<SearchResults>(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
};