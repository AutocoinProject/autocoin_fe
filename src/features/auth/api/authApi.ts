'use client';

// Auth API 함수
import axios from 'axios';
import { API_ENDPOINTS } from '@/shared/constants/api';
import { LoginResponse, UserInfo } from '@/shared/types/auth';
import config from '@/shared/config/environment';

// Refresh token 함수
export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      return false;
    }

    const response = await axios.post(`${config.apiBaseUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
      refreshToken: refreshTokenValue
    });

    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return false;
  }
};

// 로그인 함수
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${config.apiBaseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, 
      { email, password }
    );
    
    // 토큰 저장
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 회원가입 함수
export const signup = async (userData: {
  email: string;
  password: string;
  username: string;
}): Promise<UserInfo> => {
  try {
    const response = await axios.post<UserInfo>(
      `${config.apiBaseUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

// 로그아웃 함수
export const logout = async (): Promise<void> => {
  try {
    // 토큰이 있을 경우 서버에 로그아웃 요청을 보냄
    const token = localStorage.getItem('authToken');
    if (token) {
      await axios.post(
        `${config.apiBaseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }

    // 로컬 스토리지에서 인증 정보 삭제
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    // 오류가 발생해도 로컬 스토리지는 삭제
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<UserInfo> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axios.get<UserInfo>(
      `${config.apiBaseUrl}${API_ENDPOINTS.AUTH.ME}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    throw error;
  }
};
