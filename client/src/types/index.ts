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