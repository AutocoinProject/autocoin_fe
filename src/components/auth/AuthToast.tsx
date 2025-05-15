'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

interface AuthToastProps {
  type: 'signin' | 'signup' | 'custom';
  onClose: () => void;
  redirectPath?: string;
  customMessage?: string;
}

const AuthToast: React.FC<AuthToastProps> = ({
  type,
  onClose,
  redirectPath = '/dashboard',
  customMessage
}) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      router.push(redirectPath);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose, router, redirectPath]);

  const getMessage = () => {
    if (customMessage) return customMessage;
    switch (type) {
      case 'signin':
        return '로그인되었습니다! 잠시 후 대시보드로 이동합니다.';
      case 'signup':
        return '회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.';
      default:
        return '';
    }
  };

  return (
    <Toast
      message={getMessage()}
      type="success"
      duration={2000}
      onClose={onClose}
    />
  );
};

export default AuthToast; 