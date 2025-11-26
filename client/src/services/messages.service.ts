import { api } from './api';
import { Conversation, Message, ConversationDetail } from '../types';

export const messagesService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>('/messages/conversations');
    return response.data;
  },

  async getOrCreateConversation(otherUserId: string): Promise<ConversationDetail> {
    const response = await api.get<ConversationDetail>(`/messages/conversations/${otherUserId}`);
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/messages/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await api.post<Message>(`/messages/conversations/${conversationId}/messages`, { content });
    return response.data;
  }
};