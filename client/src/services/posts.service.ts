import { api } from './api';
import { Post, CreatePostData } from '../types';

export const postsService = {
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  async getPosts(type?: string, status?: string): Promise<Post[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    
    const response = await api.get<Post[]>(`/posts?${params.toString()}`);
    return response.data;
  },

  async getPost(id: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  async updatePostStatus(id: string, status: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${id}/status`, { status });
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  }
};