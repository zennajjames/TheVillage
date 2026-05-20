// React context for authentication state. On mount, verifies the stored JWT with the API
// and populates the current user. Exposes signup, login, and logout helpers app-wide.
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, SignupData, LoginData } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService
        .verifyToken(token)
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    const { token, user } = await authService.login(data);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const signup = async (data: SignupData) => {
    const { token, user } = await authService.signup(data);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const loginWithToken = async (token: string) => {
    localStorage.setItem('token', token);
    const userData = await authService.verifyToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        loginWithToken,
        logout,
        isLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};