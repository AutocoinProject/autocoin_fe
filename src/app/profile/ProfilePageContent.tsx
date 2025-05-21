'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ProfilePageContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');

  // 사용자 정보가 로드되면 상태 업데이트
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
    }
  }, [user]);

  // 로딩 중 상태 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">로그인이 필요합니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            이 페이지를 보려면 로그인이 필요합니다.
          </p>
          <div className="flex justify-center">
            <Link href="/signin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 사용자 프로필 뷰
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          {/* 프로필 헤더 */}
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                사용자 프로필
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                계정 정보와 설정
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? '취소' : '프로필 수정'}
            </button>
          </div>

          {/* 프로필 정보 */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  사용자 이름
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                    />
                  ) : (
                    user.username || '설정되지 않음'
                  )}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  이메일 주소
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  가입 방법
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {user.provider || '이메일 가입'}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  가입일
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '정보 없음'}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  역할
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {user.role === 'ADMIN' ? '관리자' : '일반 사용자'}
                </dd>
              </div>
            </dl>
          </div>

          {/* 수정 버튼 */}
          {isEditing && (
            <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:px-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => {
                  // 여기에 사용자 업데이트 로직을 구현
                  setIsEditing(false);
                }}
                className="ml-3 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                저장하기
              </button>
            </div>
          )}
        </div>

        {/* 추가 설정 카드 */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              보안 설정
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white">비밀번호 변경</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  정기적으로 비밀번호를 변경하면 계정 보안을 강화할 수 있습니다.
                </p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                변경하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}