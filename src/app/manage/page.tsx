'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import '@/utils/adminSetup'; // 관리자 설정 유틸리티 로드
import UserManagement from './components/UserManagement';
import SystemMonitoring from './components/SystemMonitoring';
import DatabaseManagement from './components/DatabaseManagement';
import BotManagement from './components/BotManagement';
import TransactionMonitoring from './components/TransactionMonitoring';
import SettingsManagement from './components/SettingsManagement';

type ManageTabType = 'users' | 'system' | 'database' | 'bots' | 'transactions' | 'settings';

export default function ManagePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ManageTabType>('users');

  // 관리자 권한 확인 (임시로 비활성화)
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/signin');
        return;
      }
      
      // 관리자가 아니면 접근 거부 (임시로 주석 처리)
      // if (!user || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN')) {
      //   router.push('/dashboard');
      //   return;
      // }
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 관리자 권한 검사 (임시로 비활성화)
  // if (!user || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN')) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="text-red-500 text-xl mb-4">⚠️ 접근 권한이 없습니다</div>
  //         <p className="text-gray-600 dark:text-gray-400">관리자만 접근할 수 있는 페이지입니다.</p>
  //       </div>
  //     </div>
  //   );
  // }

  const tabs = [
    { id: 'users' as ManageTabType, name: '사용자 관리', icon: '👥', description: '전체 사용자 계정 관리' },
    { id: 'system' as ManageTabType, name: '시스템 모니터링', icon: '📊', description: '서버 상태 및 성능 모니터링' },
    { id: 'database' as ManageTabType, name: '데이터베이스', icon: '🗄️', description: 'DB 관리 및 백업' },
    { id: 'bots' as ManageTabType, name: '봇 관리', icon: '🤖', description: '모든 거래 봇 관리' },
    { id: 'transactions' as ManageTabType, name: '거래 모니터링', icon: '💱', description: '전체 거래 내역 감시' },
    { id: 'settings' as ManageTabType, name: '시스템 설정', icon: '⚙️', description: '애플리케이션 설정 관리' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'system':
        return <SystemMonitoring />;
      case 'database':
        return <DatabaseManagement />;
      case 'bots':
        return <BotManagement />;
      case 'transactions':
        return <TransactionMonitoring />;
      case 'settings':
        return <SettingsManagement />;
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
          시스템 전체를 관리하고 모니터링합니다
        </p>
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>관리자 권한으로 접근 중</strong> - 모든 작업은 시스템에 영향을 줄 수 있으므로 신중하게 수행하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 관리자 정보 카드 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
              👑
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">
                {user?.username || '관리자'}
              </h2>
              <p className="text-indigo-100">
                {user?.email || 'admin@autocoin.com'}
              </p>
              <div className="mt-2 flex items-center">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">
                  최고 관리자
                </span>
                <span className="ml-3 text-sm text-indigo-100">
                  마지막 로그인: {new Date().toLocaleString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-100">시스템 상태</div>
            <div className="flex items-center mt-1">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-lg font-semibold">정상 운영</span>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center text-white">👥</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 사용자</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">1,247</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center text-white">🤖</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">활성 봇</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">89</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center text-white">💱</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">오늘 거래</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">2,847</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center text-white">💰</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 거래량</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">₩24.7억</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    {tab.description}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 디버깅 정보 (개발용) */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-8">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">현재 사용자 정보 (디버깅용)</h4>
        <div className="text-xs text-yellow-700 dark:text-yellow-300">
          <p>사용자: {user ? JSON.stringify(user) : '없음'}</p>
          <p>인증 상태: {isAuthenticated ? '인증됨' : '인증 안됨'}</p>
          <p>로딩 상태: {isLoading ? '로딩 중' : '완료'}</p>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
