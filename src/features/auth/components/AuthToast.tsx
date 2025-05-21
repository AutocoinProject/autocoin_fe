'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/shared/components/ui/Toast';

interface AuthToastProps {
  type: 'signin' | 'signup' | 'custom';
  onClose: () => void;
  redirectPath?: string;
  customMessage?: string;
  isError?: boolean; // 오류 여부
}

const AuthToast: React.FC<AuthToastProps> = ({
  type,
  onClose,
  redirectPath = '/dashboard',
  customMessage,
  isError = false
}) => {
  const router = useRouter();

  useEffect(() => {
    // 오류가 아니고 리디렉션 경로가 있는 경우에만 자동 리디렉션
    if (!isError && redirectPath) {
      const timer = setTimeout(() => {
        onClose();
        router.push(redirectPath);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // 오류인 경우 토스트만 보이고 리디렉션 없음
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [onClose, router, redirectPath, isError]);

  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (isError) {
      // 오류 메시지
      switch (type) {
        case 'signin':
          return '로그인에 실패했습니다.';
        case 'signup':
          return '회원가입에 실패했습니다.';
        default:
          return '오류가 발생했습니다.';
      }
    } else {
      // 성공 메시지
      switch (type) {
        case 'signin':
          return '로그인되었습니다! 잠시 후 대시보드로 이동합니다.';
        case 'signup':
          return '회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.';
        default:
          return '';
      }
    }
  }; 

  return (
    <Toast
      message={getMessage()}
      type={isError ? 'error' : 'success'}
      duration={2000}
      onClose={onClose}
    />
  );
};

export default AuthToast;
