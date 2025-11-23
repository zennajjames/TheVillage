import { api } from './api';
import { AuthResponse, SignupData, LoginData, User } from '../types';

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async verifyToken(token: string): Promise<User> {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return this.getMe();
  }
};