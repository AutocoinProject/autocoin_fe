'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // OAuth2 리디렉션 처리
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      router.push('/dashboard');
    }
  }, [searchParams, login, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic client-side validation (optional, but recommended)
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);

      // Store the token using the global login function
      if (response.data.token) {
        login(response.data.token);
        // Optional: Store user info as well if needed
        // localStorage.setItem('userInfo', JSON.stringify(response.data.user));

        // Redirect to dashboard or home page after successful login
        // TODO: 실제 대시보드 또는 메인 페이지 경로로 변경하세요.
        router.push('/dashboard'); 
      } else {
        // Handle cases where token is missing in the response
        setError('로그인 응답 형식이 올바르지 않습니다.');
      }

    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("이메일 또는 비밀번호가 일치하지 않습니다.");
        } else if (err.response.status === 400) {
          // Try to get more specific message from backend if available
          setError(err.response.data?.message || "잘못된 요청입니다. 입력값을 확인해주세요.");
        } else {
          setError(`로그인 오류 발생 (${err.response.status})`);
        }
      } else if (err.request) {
        // Network error (server down, CORS etc.)
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        // Other errors
        setError("로그인 중 예상치 못한 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 핸들러 수정
  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setLoading(true);
    setError(null);

    try {
      console.log(`${provider} 로그인 URL 요청 시작...`);
      
      const response = await fetch(`/api/v1/auth/oauth2/${provider}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log(`${provider} 로그인 URL 응답 상태:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`${provider} 로그인 URL 응답 에러:`, errorText);
        throw new Error(`서버 응답 오류 (${response.status}): ${errorText || '알 수 없는 오류'}`);
      }

      const data = await response.json();
      console.log(`${provider} 로그인 URL 응답 데이터:`, data);
      
      if (!data.url) {
        throw new Error(`${provider} 로그인 URL을 찾을 수 없습니다.`);
      }

      console.log(`리디렉션 URL:`, data.url);
      window.location.href = data.url;
    } catch (err: any) {
      console.error(`${provider} 로그인 리디렉션 실패:`, err);
      setError(err.message || `${provider} 로그인을 시작하는데 실패했습니다. 잠시 후 다시 시도해주세요.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          {/* Assuming you have a logo */}
          <Image src="/logo.svg" alt="AutoCoin Logo" width={48} height={48} />
        </div>
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <p className="text-sm text-center text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Optional: Add forgot password link here */}
           <div className="flex items-center justify-end text-sm">
             <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
               Forgot your password?
             </a>
           </div> 

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* "Or continue with" separator and OAuth buttons */}
         <div className="relative mt-6">
           <div className="absolute inset-0 flex items-center" aria-hidden="true">
             <div className="w-full border-t border-gray-300 dark:border-gray-600" />
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
           </div>
         </div>

         <div className="mt-6 space-y-3">
           <div>
             <button
               onClick={() => handleSocialLogin('google')}
               disabled={loading}
               className={`inline-flex w-full items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               <span className="sr-only">Sign in with Google</span>
               {loading ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               ) : (
                 <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                   <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                 </svg>
               )}
               {loading ? '처리 중...' : 'Sign in with Google'}
             </button>
           </div>
           <div>
             <button
               onClick={() => handleSocialLogin('kakao')}
               disabled={loading}
               className={`inline-flex w-full items-center justify-center rounded-md border border-transparent bg-[#FEE500] py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               <span className="sr-only">Sign in with Kakao</span>
               {loading ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               ) : (
                 <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 36.7">
                   <path fill="currentColor" d="M19.4 17.2c-.7 0-1.4-.1-2.1-.4-.7-.2-1.3-.6-1.8-1-.5-.4-1-.9-1.3-1.5s-.5-1.3-.5-2.1c0-1.3.5-2.4 1.4-3.4.9-1 2.1-1.4 3.4-1.4 1.3 0 2.4.5 3.4 1.4.9.9 1.4 2.1 1.4 3.4 0 .8-.2 1.5-.5 2.1-.4.6-.9 1.1-1.3 1.5-.5.4-1.1.7-1.8 1-.7.2-1.4.4-2.1.4zm10.6 8.7c.6-.6.9-1.2 1.1-2 .2-.7.2-1.5.1-2.3-.1-.8-.4-1.6-.9-2.3-.5-.7-.9-1.3-1.5-1.9-.6-.6-.6-1.2-.9-2-1.1-.7-.2-1.5-.2-2.3-.1-.8.1-1.6.4-2.3.9-.7.5-1.3.9-1.9 1.5-.6.6-.9 1.2-1.1 2-.2.7-.2 1.5-.1 2.3.1.8.4 1.6.9 2.3.5.7.9 1.3 1.5 1.9.6.6 1.2.9 2 1.1.7.2 1.5.2 2.3.1.8-.1 1.6-.4 2.3-.9.7-.5 1.3-.9 1.9-1.5zm-21.1-1.8c.6.6.9 1.2 1.1 2 .2.7.2 1.5.1 2.3-.1.8-.4 1.6-.9 2.3-.5.7-.9 1.3-1.5 1.9-.6.6-1.2.9-2 1.1-.7.2-1.5.2-2.3.1-.8-.1-1.6-.4-2.3-.9-.7-.5-1.3-.9-1.9-1.5-.6-.6-.9-1.2-1.1-2-.2-.7-.2-1.5-.1-2.3.1-.8.4 1.6.9-2.3.5-.7.9-1.3 1.5-1.9.6-.6 1.2-.9 2-1.1.7-.2 1.5-.2 2.3-.1.8.1 1.6.4 2.3.9.7.5 1.3.9 1.9 1.5zm19.8-15.4C28.9 6.8 27.1 6 25 5.7c-.7-.1-1.4-.1-2.1-.1h-.3c-1 0-2.1.2-3.1.7-1.1.5-2 1.1-2.9 2s-1.5 1.9-2 2.9-.7 2.1-.7 3.1v.3c0 .7.1 1.4.1 2.1.1 2.1.9 3.9 2.3 5.4s3.3 2.3 5.4 2.3h.3c.7 0 1.4-.1 2.1-.1 2.1-.1 3.9-.9 5.4-2.3 1.4-1.4 2.3-3.3 2.3-5.4v-.3c0-.7-.1-1.4-.1-2.1z"></path>
                 </svg>
               )}
               {loading ? '처리 중...' : 'Sign in with Kakao'}
             </button>
           </div>
         </div>

         <div className="text-sm text-center mt-4">
           <p className="text-gray-600 dark:text-gray-400">
              Don\'t have an account yet?{''}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign up
              </Link>
           </p>
          </div>
      </div>
    </div>
  );
} 