'use client';

// 최상위 레벨에서 useAuth를 사용하지 않도록 수정 - Suspense로 감싸진 컴포넌트로 분리
import React, { Suspense } from 'react';
import ProfilePageContent from './ProfilePageContent';

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}