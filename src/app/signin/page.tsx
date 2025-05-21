'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginResponse, ErrorResponse, ERROR_MESSAGES } from '@/types/auth';
import config from '@/config/environment';
import AuthToast from '@/components/auth/AuthToast';

// API_BASE_URL을 환경 설정에서 가져옴
const API_BASE_URL = config.apiBaseUrl;

// 서버 상태 확인 함수
async function checkServerHealth() {
  try {
    // 일반 서버 상태 확인 API 호출
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('Server health check:', healthResponse.data);
    return true;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // 서버 상태 주기적 확인 함수
  const checkPeriodicHealth = () => {
    // 5초마다 서버 상태 확인
    const healthCheckInterval = setInterval(async () => {
      try {
        const isHealthy = await checkServerHealth();
        if (isHealthy) {
          // 서버가 정상일 경우 알림 표시 및 인터벌 중지
          setError('서버 연결이 복구되었습니다. 다시 시도해보세요.');
          clearInterval(healthCheckInterval);
        }
      } catch (error) {
        console.error('정기적 상태 확인 실패:', error);
      }
    }, 5000);

    // 1분 후 상태 확인 중지
    setTimeout(() => {
      clearInterval(healthCheckInterval);
    }, 60000);

    return healthCheckInterval;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIsLoginError(false); // 로그인 시도 시 오류 상태 초기화

    // 서버 상태 확인
    try {
      const isServerHealthy = await checkServerHealth();
      if (!isServerHealthy) {
        setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        setLoading(false);
        setIsLoginError(true);
        setShowAuthToast(true);
        return;
      }
    } catch (err) {
      console.error('서버 상태 확인 중 오류 발생:', err);
    }

    // Basic client-side validation
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    console.log('로그인 요청 정보:', { 
      url: `${API_BASE_URL}/api/v1/auth/login`,
      email,
      // 비밀번호는 로그하지 않음
    });

    try {
      // 백엔드 API 경로 - /api/v1/auth/login
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
        timeout: 30000, // 30초 타임아웃으로 증가
      });

      console.log('🎉 =====  LOGIN RESPONSE DEBUG =====');
      console.log('Raw response object:', response);
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response headers:', response.headers);
      console.log('Response config:', response.config);
      
      // 응늵 데이터 상세 분석
      console.log('🔍 Response data type:', typeof response.data);
      console.log('🔍 Response data:', response.data);
      console.log('🔍 Response data stringified:', JSON.stringify(response.data, null, 2));
      
      // 다양한 방법으로 토큰과 사용자 추출 시도
      let token, user;
      const data = response.data;
      
      // 방법 1: 직접 접근 (표준 JSON 응답)
      if (data && typeof data === 'object' && data.token) {
        token = data.token;
        user = data.user;
        console.log('✅ 방법 1 성공: 표준 JSON 응답');
      }
      // 방법 2: 문자열 응답에서 JSON 추출 (이 서버의 실제 응답 형태)
      else if (typeof data === 'string') {
        console.log('🔍 문자열 응답 감지, JSON 추출 시도...');
        
        // 정규식으로 JSON 부분 추출
        const jsonMatch = data.match(/\{"user".*?"token":"[^"]+"\}/);
        if (jsonMatch) {
          try {
            const jsonStr = jsonMatch[0];
            console.log('🔍 추출된 JSON 문자열:', jsonStr);
            const parsed = JSON.parse(jsonStr);
            token = parsed.token;
            user = parsed.user;
            console.log('✅ 방법 2 성공: 정규식으로 JSON 추출');
          } catch (parseError) {
            console.error('❌ JSON 파싱 실패:', parseError);
          }
        }
        
        // 만약 위 방법이 실패하면, 토큰만이라도 추출
        if (!token) {
          const tokenMatch = data.match(/"token":"([^"]+)"/);
          if (tokenMatch) {
            token = tokenMatch[1];
            console.log('✅ 토큰만 추출 성공');
            
            // 사용자 정보도 추출 시도
            const userMatch = data.match(/"user":\{[^\}]+\}/);
            if (userMatch) {
              try {
                const userStr = userMatch[0].replace('"user":', '');
                user = JSON.parse(userStr);
                console.log('✅ 사용자 정보도 추출 성공');
              } catch (e) {
                console.warn('⚠️ 사용자 정보 추출 실패, 토큰만 사용');
              }
            }
          }
        }
      }
      
      console.log('===== FINAL EXTRACTED VALUES =====');
      console.log('Final token:', token);
      console.log('Final token type:', typeof token);
      console.log('Final token length:', token ? token.length : 'N/A');
      console.log('Final user:', user);
      console.log('Final user type:', typeof user);
      console.log('===================================');
      
      // 토큰 없으면 오류 처리
      if (!token || typeof token !== 'string' || token.trim() === '') {
        console.error('🚨 토큰을 찾을 수 없습니다!');
        console.error('🚨 Response data dump:', JSON.stringify(response, null, 2));
        setError('로그인 응답에서 토큰을 찾을 수 없습니다. 서버 응답을 확인해주세요.');
        setLoading(false);
        return;
      }
      
      // 로그인 성공 처리
      console.log('🚀 Calling login function with valid token!');
      console.log('🚀 Token preview:', token.substring(0, 50) + '...');
      console.log('🚀 User data:', user);
      
      login(token, user);
      
      // 로그인 성공 메시지 표시
      setError(null); // 오류 메시지 초기화
      setIsLoginError(false); // 성공이므로 오류 아님
      setShowAuthToast(true);
      
      // 상태 변경 후 지연 시간을 두고 대시보드로 이동
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Login failed:', err);
      setIsLoginError(true); // 오류 발생
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
          console.error('Network Error Details:', {
            message: err.message,
            code: err.code,
            config: {
              url: err.config?.url,
              method: err.config?.method,
              headers: err.config?.headers,
              baseURL: err.config?.baseURL,
              data: err.config?.data
            },
            browserInfo: {
              userAgent: navigator.userAgent,
              currentOrigin: window.location.origin
            }
          });
          console.info('로그인 실패: 네트워크 오류');
          
          // 서버 상태 주기적 확인 시작
          checkPeriodicHealth();
        } else if (err.response) {
          const errorData = err.response.data as ErrorResponse;
          
          console.error('Server Error Response:', {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          });
          
          // API 명세서의 에러 코드에 따른 메시지 표시
          if (errorData.code && ERROR_MESSAGES[errorData.code]) {
            setError(ERROR_MESSAGES[errorData.code]);
          } else {
            // 기본 에러 메시지
            switch (err.response.status) {
              case 401:
                setError(ERROR_MESSAGES['U004']); // INVALID_CREDENTIALS
                break;
              case 404:
                setError(ERROR_MESSAGES['U003']); // EMAIL_NOT_FOUND
                break;
              case 400:
                setError(errorData.message || ERROR_MESSAGES['C001']); // INVALID_INPUT
                break;
              case 500:
                setError('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                break;
              default:
                setError(`서버 오류 (${err.response.status}): ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
          }
          console.info('로그인 실패: 서버 오류 응답', { status: err.response.status });
        } else if (err.request) {
          setError('서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.');
          console.error('Request Error Details:', {
            message: err.message,
            request: err.request
          });
          console.info('로그인 실패: 서버 응답 없음');
        } else {
          setError('로그인 요청을 보내는 중 오류가 발생했습니다.');
          console.error('Error Details:', err);
          console.info('로그인 실패: 기타 오류');
        }
      } else {
        setError('예상치 못한 오류가 발생했습니다.');
        console.error('Unexpected Error:', err);
        console.info('로그인 실패: 예상치 못한 오류');
      }

      // 로그인 실패 시 Toast 보이기
      setShowAuthToast(true);
    } finally {
      setLoading(false);
    }
  };

  // OAuth2 리디렉션 처리
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // 서버 상태 먼저 확인
      checkServerHealth().then(isHealthy => {
        if (!isHealthy) {
          setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
          setIsLoginError(true);
          return;
        }
        
        // OAuth2 로그인의 경우 사용자 정보를 가져와야 함
        axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          login(token, response.data);
          router.push('/dashboard');
        }).catch(err => {
          console.error('Failed to fetch user info:', err);
          setError('사용자 정보를 가져오는데 실패했습니다.');
          setIsLoginError(true);
        });
      });
    }
  }, [searchParams, login, router]);

  // 소셜 로그인 핸들러
  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setLoading(true);
    setError(null);
    setIsLoginError(false);

    // 서버 상태 확인
    try {
      const isServerHealthy = await checkServerHealth();
      if (!isServerHealthy) {
        setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        setLoading(false);
        setIsLoginError(true);
        setShowAuthToast(true);
        return;
      }
    } catch (err) {
      console.error('서버 상태 확인 중 오류 발생:', err);
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/auth/oauth2/${provider}`);
      const data = response.data;
      
      if (!data.url) {
        throw new Error(`${provider} 로그인 URL을 찾을 수 없습니다.`);
      }

      // 소셜 로그인 URL로 리다이렉트
      window.location.href = data.url;
    } catch (err: any) {
      console.error(`${provider} 로그인 리디렉션 실패:`, err);
      setError(err.message || `${provider} 로그인을 시작하는데 실패했습니다. 잠시 후 다시 시도해주세요.`);
      setLoading(false);
      setIsLoginError(true);
      setShowAuthToast(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      {showAuthToast && (
        <AuthToast
          type="signin"
          onClose={() => setShowAuthToast(false)}
          isError={isLoginError}
          redirectPath={isLoginError ? undefined : '/dashboard'}
          customMessage={isLoginError ? (error || '로그인에 실패했습니다.') : undefined}
        />
      )}
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
              Don't have an account yet?{' '}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign up
              </Link>
           </p>
          </div>
      </div>
    </div>
  );
}
