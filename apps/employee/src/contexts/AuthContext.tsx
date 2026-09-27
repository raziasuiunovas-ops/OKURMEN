'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verify2FA: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.auth.getMe();
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        
        // Verify user is employee or admin
        if (userData.role !== 'EMPLOYEE' && userData.role !== 'ADMIN') {
          console.error('User is not an employee');
          localStorage.removeItem('auth-token');
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);
      } else {
        localStorage.removeItem('auth-token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.auth.request2FA(email, password);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const verify2FA = async (email: string, code: string) => {
    const response = await apiClient.auth.verify2FA(email, code);
    
    if (response.data.success && response.data.data.token) {
      const token = response.data.data.token;
      const userData = response.data.data.user;

      // Verify user is employee or admin
      if (userData.role !== 'EMPLOYEE' && userData.role !== 'ADMIN') {
        throw new Error('Access denied. Employee access required.');
      }

      localStorage.setItem('auth-token', token);
      setUser(userData);
      router.push('/employee');
    } else {
      throw new Error(response.data.message || '2FA verification failed');
    }
  };

  const logout = async () => {
    try {
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      setUser(null);
      router.push('/auth/signin');
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verify2FA,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
