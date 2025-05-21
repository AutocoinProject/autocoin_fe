"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import config from '@/config/environment';

export default function Topbar() {
  const { isAuthenticated: isLoggedIn, user, logout } = useAuth();
  const [theme, setTheme] = useState('light');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // 디버깅용 로그
  useEffect(() => {
    console.log('Topbar auth state:', { isLoggedIn, user });
  }, [isLoggedIn, user]);

  // 백엔드 서버 연결 상태 확인
  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      // 서버 건강 상태 확인 - /api/health 경로로 수정
      const response = await axios.get(`${config.apiBaseUrl}/api/health`, { timeout: 5000 });
      setServerStatus('online');
      console.log('Server is online:', response.data);
    } catch (error) {
      setServerStatus('offline');
      console.error('Server connection error:', error);
    }
    setLastChecked(new Date());
  };

  // 컴포넌트 로드 시 및 30초마다 서버 상태 확인
  useEffect(() => {
    checkServerStatus();
    
    const interval = setInterval(() => {
      checkServerStatus();
    }, 100000); // 100초마다 상태 확인
    
    return () => clearInterval(interval);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // In a real implementation, we would update the theme in localStorage and document classes
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button className="mr-4 md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="py-2 pl-10 pr-4 w-48 md:w-64 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 서버 상태 표시 */}
          <div className="flex items-center mr-2" 
            title={`서버 상태: ${serverStatus === 'online' ? '온라인' : serverStatus === 'offline' ? '오프라인' : '확인 중'}
${lastChecked ? `마지막 확인: ${lastChecked.toLocaleTimeString()}` : ''}`}
            onClick={checkServerStatus}
            style={{ cursor: 'pointer' }}
          >
            <div className={`h-3 w-3 rounded-full mr-1 ${serverStatus === 'online' ? 'bg-green-500' : serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs font-medium">
              {serverStatus === 'online' ? '서버 연결됨' : serverStatus === 'offline' ? '서버 연결 안됨' : '서버 확인 중'}
            </span>
          </div>
          
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="flex items-center space-x-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.username || '사용자'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || ''}
                  </span>
                </div>
              </Link>
              <button 
                onClick={logout}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  로그인
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  회원가입
                </button>
              </Link>
            </>
          )}
          
          <button 
            onClick={toggleTheme} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            aria-label="테마 변경"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
          
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </button>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </header>
  );
}
