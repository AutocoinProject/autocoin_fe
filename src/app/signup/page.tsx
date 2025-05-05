'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setNameError(null);
    setError(null);

    let isValid = true;

    if (!name.trim()) {
      setNameError("사용자 이름은 필수 입력값입니다.");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("이메일은 필수 입력 필드입니다.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 형식이 아닙니다.");
      isValid = false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) {
      setPasswordError("비밀번호는 필수 입력값입니다.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 영문자, 숫자, 특수문자를 포함해야 합니다.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/signup', {
        email,
        password,
        username: name
      });

      console.log('Signup successful:', response.data);
      router.push('/signin');

    } catch (err: any) {
      console.error('Signup failed:', err);
      if (err.response?.status === 409) {
        setEmailError("이미 사용 중인 이메일입니다.");
      } else {
        setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
           <Image src="/logo.svg" alt="AutoCoin Logo" width={48} height={48} />
        </div>
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create your AutoCoin account
          </h2>
           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}<Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
             <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                 value={name}
                onChange={(e) => setName(e.target.value)}
                className="relative block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Name"
              />
              {nameError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
            </div>
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
                 className="relative block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Email address"
              />
              {emailError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className="relative block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Password"
              />
              {passwordError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{passwordError}</p>}
            </div>
             <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                 className="relative block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Confirm Password"
              />
              {confirmPasswordError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{confirmPasswordError}</p>}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
            >
              {loading ? '처리 중...' : 'Create Account'}
            </button>
          </div>
        </form>
         <div className="text-sm text-center mt-4">
           <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}<Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign in
              </Link>
           </p>
          </div>
      </div>
    </div>
  );
} 