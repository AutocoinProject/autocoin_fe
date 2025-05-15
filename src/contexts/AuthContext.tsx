"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoginResponse, ErrorResponse, ERROR_MESSAGES } from '@/types/auth';
import config from '@/config/environment';

interface UserInfo {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 토큰으로 사용자 정보 가져오기
  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const response = await axios.get<UserInfo>(`${config.apiBaseUrl}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ErrorResponse;
        if (errorData.code && ERROR_MESSAGES[errorData.code]) {
          setError(ERROR_MESSAGES[errorData.code]);
        } else {
          setError('사용자 정보를 가져오는데 실패했습니다.');
        }
      }
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  // 인증 상태 확인
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser) as UserInfo;
        setUser(userData);
        setIsAuthenticated(true);
        // 토큰 유효성 검사를 위해 사용자 정보 다시 가져오기
        await fetchUserInfo(token);
      } catch (err) {
        console.error('저장된 사용자 정보 파싱 실패:', err);
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [fetchUserInfo]);

  // 로그인
  const login = useCallback((token: string, userData: UserInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      checkAuth
    }}>
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