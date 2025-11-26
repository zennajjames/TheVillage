import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messagesService } from '../services/messages.service';
import { Conversation } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const data = await messagesService.getConversations();
      setConversations(data);
    } catch (err: any) {
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading conversations...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6">
              Start a conversation by contacting someone from a post or group!
            </p>
            <button
              onClick={() => navigate('/posts')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Browse Posts
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/messages/${conversation.id}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  {conversation.otherUser.profilePicture ? (
                    <img
                      src={conversation.otherUser.profilePicture}
                      alt={conversation.otherUser.firstName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center text-lg font-bold text-purple-600">
                      {conversation.otherUser.firstName[0]}{conversation.otherUser.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {conversation.otherUser.firstName} {conversation.otherUser.lastName}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage ? (
                      <p className={`text-sm truncate ${
                        !conversation.lastMessage.isRead && conversation.lastMessage.senderId !== user?.id
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage.senderId === user?.id && 'You: '}
                        {conversation.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No messages yet</p>
                    )}
                  </div>
                  {conversation.lastMessage && 
                   !conversation.lastMessage.isRead && 
                   conversation.lastMessage.senderId !== user?.id && (
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;