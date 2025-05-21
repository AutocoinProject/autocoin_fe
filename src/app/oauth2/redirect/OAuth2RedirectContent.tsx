'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function OAuth2RedirectContent() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    console.log('OAuth redirect - URL:', window.location.href);
    console.log('OAuth redirect - token:', token ? 'EXISTS' : 'NULL');
    console.log('OAuth redirect - error:', error);

    if (token) {
      console.log('Processing token...', token.substring(0, 20) + '...');
      
      // 즉시 토큰 저장 (authToken으로 저장)
      localStorage.setItem('authToken', token);
      console.log('Token saved to localStorage as authToken');

      // 사용자 정보 가져오기
      fetchUserInfo(token)
        .then((userData) => {
          console.log('User data received:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          login(token, userData);
          console.log('Login completed, redirecting to dashboard...');
          setLoading(false);
          router.push('/dashboard');
        })
        .catch((err) => {
          console.error('사용자 정보 가져오기 실패:', err);
          console.log('Fallback: using token only');
          // 사용자 정보 없이도 로그인 처리
          login(token);
          setLoading(false);
          router.push('/dashboard');
        });
    } else if (error) {
      console.error('OAuth error:', error);
      setError(error);
      setLoading(false);
    } else {
      console.error('No token or error found in URL');
      setError('인증 토큰을 찾을 수 없습니다.');
      setLoading(false);
    }
  }, [searchParams, login, router]);

  // 사용자 정보 가져오기 함수
  const fetchUserInfo = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://112.171.131.161:8080';
      console.log('Fetching user info from:', `${apiUrl}/api/v1/auth/me`);
      
      const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('User info response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('User info response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const userData = await response.json();
      console.log('User info parsed:', userData);
      return userData;
    } catch (error) {
      console.error('fetchUserInfo error:', error);
      throw error;
    }
  };

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">로그인 처리 중입니다...</p>
          <p className="mt-2 text-xs text-gray-500">토큰을 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">로그인 중 오류가 발생했습니다: {error}</p>
          <button
            onClick={() => router.push('/signin')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
}