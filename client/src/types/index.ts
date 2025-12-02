// User types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePicture?: string;
  bio?: string;
  isAdmin?: boolean;
  emailNotifications?: boolean;
  notifyOnMessages?: boolean;
  notifyOnPosts?: boolean;
  notifyOnGroups?: boolean;
  showEmail?: boolean;
  showAddress?: boolean;
  allowMessages?: boolean;
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

// Community types
export interface Community {
  id: string;
  name: string;
  description: string;
  location?: string;
  address?: string;
  zipCode?: string;
  coverImage?: string;
  isPrivate: boolean;
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
    groups: number;
  };
  isMember?: boolean;
  userRole?: string | null;
  members?: CommunityMember[];
  groups?: Group[];
}

export interface CommunityMember {
  id: string;
  communityId: string;
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

export interface CreateCommunityData {
  name: string;
  description: string;
  location?: string;
  address?: string;
  zipCode?: string;
  isPrivate: boolean;
  coverImage?: string;
}

// Group types
export interface Group {
  id: string;
  communityId: string;
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  coverImage?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  community?: {
    id: string;
    name: string;
  };
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
  communityId: string;
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
}

// SubGroup types
export interface SubGroup {
  id: string;
  parentGroupId: string;
  name: string;
  description?: string;
  teacherName?: string;
  grade?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
  };
  isMember?: boolean;
  members?: SubGroupMember[];
}

export interface SubGroupMember {
  id: string;
  subGroupId: string;
  userId: string;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface CreateSubGroupData {
  parentGroupId: string;
  name: string;
  description?: string;
  teacherName?: string;
  grade?: string;
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