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