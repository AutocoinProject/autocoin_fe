"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// 1. 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 2. 컨텍스트 생성 (기본값은 undefined 또는 적절한 초기값 설정)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. 컨텍스트 제공자(Provider) 컴포넌트 생성
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 컴포넌트 마운트 시 localStorage 확인 (기존 Topbar 로직 이동)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 로그인 함수
  const login = useCallback((token: string) => {
    localStorage.setItem('accessToken', token);
    setIsLoggedIn(true);
    // 로그인 성공 알림 (선택 사항)
    // toast.success("로그인 되었습니다."); 
  }, []);

  // 로그아웃 함수 (기존 Topbar 로직 + 알림)
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    toast.success("로그아웃 되었습니다.");
    // 필요시 추가 처리 (예: 로그인 페이지로 리다이렉트)
    // router.push('/signin'); // Context에서는 router 직접 사용 어려움. 필요시 props나 다른 방식 사용
  }, []);

  // Provider가 제공할 값
  const value = { isLoggedIn, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. 커스텀 훅 생성 (쉽게 컨텍스트 사용하기 위함)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 