// providers/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import authApi from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' ? token : null;
  } catch {
    return null;
  }
};

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      return null;
    }
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clean up invalid storage data on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser === 'undefined' || storedUser === 'null') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }

    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await authApi.getMe();
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const { token: authToken, user: userData } = response;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(authToken);
      setUser(userData as User);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      const { token: authToken, user: userData } = response;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(authToken);
      setUser(userData as User);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};