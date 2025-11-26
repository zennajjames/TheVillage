// User types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  zipCode?: string;
  profilePicture?: string;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  zipCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Post types
export enum PostType {
  REQUEST = 'REQUEST',
  OFFER = 'OFFER'
}

export enum PostStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  FULFILLED = 'FULFILLED',
  CLOSED = 'CLOSED'
}

export interface Post {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  description: string;
  location: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    location: string;
  };
}

export interface CreatePostData {
  type: PostType;
  title: string;
  description: string;
  location: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  isPrivate: boolean;
  coverImage?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  _count?: {
    members: number;
    posts: number;
  };
  isMember?: boolean;
  userRole?: string | null;
  members?: GroupMember[];
  posts?: GroupPost[];
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    location: string;
  };
}

export interface GroupPost {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  location: string;
  category: string;
  isPrivate: boolean;
}

// Messaging types
export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface ConversationDetail {
  id: string;
  participants: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
  }>;
}