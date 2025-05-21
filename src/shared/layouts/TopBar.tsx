'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AuthToast from '@/features/auth/components/AuthToast';

export default function TopBar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showLogoutToast, setShowLogoutToast] = React.useState(false);

  // 디버깅용 콘솔 출력
  React.useEffect(() => {
    console.log('TopBar user:', user, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  }, [user, isAuthenticated, isLoading]);

  const handleLogout = async () => {
    await logout();
    setShowLogoutToast(true);
    setTimeout(() => {
      setShowLogoutToast(false);
      router.push('/signin');
    }, 2000);
  };

  // 인증 상태 로딩 중이면 아무것도 렌더링하지 않음
  if (isLoading) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/logo.svg" alt="AutoCoin Logo" width={32} height={32} />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AutoCoin</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {(isAuthenticated || showLogoutToast) ? (
              <>
                {isAuthenticated && (
                  <>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user?.username || user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                    >
                      로그아웃
                    </button>
                  </>
                )}
                {showLogoutToast && (
                  <AuthToast
                    type="custom"
                    onClose={() => setShowLogoutToast(false)}
                    redirectPath="/signin"
                    customMessage="로그아웃되었습니다."
                  />
                )}
              </>
            ) : (
              <Link
                href="/signin"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-150"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 