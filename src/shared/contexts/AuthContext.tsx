"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoginResponse, ErrorResponse, ERROR_MESSAGES } from '@/shared/types/auth';
import config from '@/shared/config/environment';

interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: string;
  provider?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user?: UserInfo) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 디버깅용 로그
  useEffect(() => {
    console.log('AuthProvider state:', { user, isAuthenticated, isLoading });
  }, [user, isAuthenticated, isLoading]);

  // 토큰으로 사용자 정보 가져오기
  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const response = await axios.get<UserInfo>(`${config.apiBaseUrl}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });
      
      console.log('User info received:', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error('fetchUserInfo error:', err);
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw err;
    }
  }, []);

  // 인증 상태 확인
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    console.log('CheckAuth - token:', token ? 'EXISTS' : 'NULL', 'savedUser:', savedUser);
    
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
      console.log('No auth data found in storage');
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [fetchUserInfo]);

  // 로그인
  const login = useCallback((token: string, userData?: UserInfo) => {
    console.log('🔑 Login function called');
    console.log('  - Token exists:', !!token);
    console.log('  - User data provided:', !!userData);
    console.log('  - User data:', userData);
    
    if (!token) {
      console.error('❌ 토큰이 제공되지 않았습니다.');
      return;
    }

    try {
      // authToken으로 저장 (API 명세서에 맞춤)
      localStorage.setItem('authToken', token);
      console.log('✅ Token saved to localStorage as authToken');
      
      if (userData) {
        // 사용자 데이터가 제공된 경우
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User data saved to localStorage:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
      } else {
        // 사용자 데이터가 없는 경우
        console.log('⚠️  No user data provided, will fetch from API');
        setIsAuthenticated(true); // 일단 토큰이 있으므로 인증된 것으로 처리
        setError(null);
        // API에서 사용자 정보 가져오기는 checkAuth에서 처리
      }
    } catch (error) {
      console.error('❌ Login 중 오류 발생:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 사용자 정보 업데이트 함수
  const updateUser = useCallback((userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      checkAuth,
      updateUser
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
