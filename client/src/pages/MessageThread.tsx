import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagesService } from '../services/messages.service';
import { Message } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Header from '../components/layout/Header';

const MessageThread: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    if (socket && conversationId) {
      // Join conversation room
      socket.emit('join_conversation', conversationId);

      // Listen for new messages
      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicator
      socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
        if (data.userId !== user?.id) {
          setIsTyping(data.isTyping);
        }
      });

      return () => {
        socket.emit('leave_conversation', conversationId);
        socket.off('new_message');
        socket.off('user_typing');
      };
    }
  }, [socket, conversationId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      if (!conversationId) return;
      setIsLoading(true);
      const data = await messagesService.getMessages(conversationId);
      setMessages(data);
      
      // Get other user info from first message
      if (data.length > 0) {
        const firstMessage = data[0];
        const other = firstMessage.sender.id === user?.id 
          ? null 
          : firstMessage.sender;
        setOtherUser(other);
      }
    } catch (err: any) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const message = await messagesService.sendMessage(conversationId, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Emit to socket
      if (socket) {
        socket.emit('send_message', { conversationId, message });
        socket.emit('typing', { conversationId, isTyping: false });
      }
    } catch (err: any) {
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (socket && conversationId) {
      socket.emit('typing', { conversationId, isTyping: value.length > 0 });
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { conversationId, isTyping: false });
      }, 1000);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const messagesByDate = groupMessagesByDate();
  const otherParticipant = messages.length > 0 
    ? messages.find(m => m.sender.id !== user?.id)?.sender 
    : otherUser;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/messages')}
            className="text-purple-600 hover:text-purple-700"
          >
            ← Back
          </button>
          {otherParticipant && (
            <div className="flex items-center gap-3">
              {otherParticipant.profilePicture ? (
                <img
                  src={otherParticipant.profilePicture}
                  alt={otherParticipant.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-600">
                  {otherParticipant.firstName[0]}{otherParticipant.lastName[0]}
                </div>
              )}
              <div>
                <h2 className="font-semibold text-gray-900">
                  {otherParticipant.firstName} {otherParticipant.lastName}
                </h2>
                {isTyping && (
                  <p className="text-sm text-gray-500 italic">typing...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            Object.entries(messagesByDate).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>
                {dateMessages.map((message, index) => {
                  const isOwn = message.sender.id === user?.id;
                  const showAvatar = index === 0 || 
                    dateMessages[index - 1].sender.id !== message.sender.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwn && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && (
                            message.sender.profilePicture ? (
                              <img
                                src={message.sender.profilePicture}
                                alt={message.sender.firstName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-600">
                                {message.sender.firstName[0]}{message.sender.lastName[0]}
                              </div>
                            )
                          )}
                        </div>
                      )}
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;