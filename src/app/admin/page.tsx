'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UserManagement from './components/UserManagement';
import SystemMonitoring from './components/SystemMonitoring';
import LogViewer from './components/LogViewer';
import DatabaseManagement from './components/DatabaseManagement';

type AdminTabType = 'users' | 'system' | 'logs' | 'database';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabType>('users');

  // 관리자 권한 확인
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/signin');
        return;
      }
      
      // 관리자가 아니면 접근 거부
      if (!user || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN')) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ 접근 권한이 없습니다</div>
          <p className="text-gray-600 dark:text-gray-400">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users' as AdminTabType, name: '사용자 관리', icon: '👥' },
    { id: 'system' as AdminTabType, name: '시스템 모니터링', icon: '📊' },
    { id: 'logs' as AdminTabType, name: '로그 뷰어', icon: '📋' },
    { id: 'database' as AdminTabType, name: '데이터베이스', icon: '🗄️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'system':
        return <SystemMonitoring />;
      case 'logs':
        return <LogViewer />;
      case 'database':
        return <DatabaseManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          관리자 대시보드
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          시스템 관리 및 사용자 관리 기능
        </p>
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>관리자 권한으로 로그인되었습니다.</strong> 시스템에 미치는 영향을 고려하여 신중하게 작업하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
