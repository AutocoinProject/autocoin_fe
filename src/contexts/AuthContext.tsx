"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// 사용자 정보 타입 정의
interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

// 1. 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

// 2. 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. 컨텍스트 제공자(Provider) 컴포넌트 생성
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // 컴포넌트 마운트 시 localStorage 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
        }
      }
    }
  }, []);

  // 로그인 함수
  const login = useCallback((token: string, userData?: User) => {
    localStorage.setItem('accessToken', token);
    setIsLoggedIn(true);
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  // 로그아웃 함수
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    toast.success("로그아웃 되었습니다.");
  }, []);

  // 사용자 정보 업데이트 함수
  const updateUser = useCallback((userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Provider가 제공할 값
  const value = { isLoggedIn, user, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. 커스텀 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 