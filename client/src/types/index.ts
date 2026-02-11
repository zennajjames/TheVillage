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
  notifyOnCommunities?: boolean;
  showEmail?: boolean;
  showAddress?: boolean;
  allowMessages?: boolean;
  appearInSearch?: boolean;
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
  agreedToGuidelines?: boolean;
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
  communityId: string;
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
  community: {
    id: string;
    name: string;
  };
}

export interface CreatePostData {
  type: PostType;
  title: string;
  description: string;
  location: string;
  communityId: string;
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
  category?: string | null;
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
    communityPosts: number;
    subGroups?: number;
  };
  isMember?: boolean;
  userRole?: string | null;
  joinRequestStatus?: 'PENDING' | 'APPROVED' | 'DENIED' | null;
  joinRequestId?: string | null;
  members?: CommunityMember[];
  posts?: CommunityPost[];
  subGroups?: SubGroup[];
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
  category?: string;
}

// Join Request types
export interface JoinRequest {
  id: string;
  communityId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    location: string;
    bio?: string;
  };
}

// Place suggestion types (Google Places results)
export interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  category: string;
}

// Community Post types
export interface CommunityPost {
  id: string;
  communityId: string;
  userId: string;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// SubGroup types
export interface SubGroup {
  id: string;
  parentCommunityId: string;
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
  parentCommunityId: string;
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

// Help Request types
export enum RequestVisibility {
  PUBLIC = 'PUBLIC',
  SEMI_ANONYMOUS = 'SEMI_ANONYMOUS',
  ADMIN_ONLY = 'ADMIN_ONLY',
}

export interface HelpRequest {
  id: string;
  communityId: string;
  userId: string | null;
  title: string;
  description: string;
  category: string;
  visibility: RequestVisibility;
  status: PostStatus;
  proxyPostId?: string | null;
  isAnonymousToPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  } | null;
  community: {
    id: string;
    name: string;
  };
}

export interface CreateHelpRequestData {
  communityId: string;
  title: string;
  description: string;
  category: string;
  visibility: RequestVisibility;
}

// Event types
export enum EventStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  address?: string | null;
  zipCode?: string | null;
  startDate: string;
  endDate: string;
  communityId: string;
  userId: string;
  status: EventStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    email?: string;
  };
  community: {
    id: string;
    name: string;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  location?: string;
  address?: string;
  zipCode?: string;
  startDate: string;
  endDate: string;
  communityId: string;
}