// 안전한 localStorage 액세스를 위한 유틸리티

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  getJSON: <T>(key: string): T | null => {
    const item = safeLocalStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return null;
    
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage (${key}):`, error);
      // 손상된 데이터 제거
      safeLocalStorage.removeItem(key);
      return null;
    }
  },

  setJSON: <T>(key: string, value: T): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      return safeLocalStorage.setItem(key, jsonString);
    } catch (error) {
      console.error(`Error stringifying to JSON for localStorage (${key}):`, error);
      return false;
    }
  }
};

// 편의 함수들 - API 명세서에 맞춰 authToken으로 변경
export const getAuthToken = (): string | null => {
  return safeLocalStorage.getItem('authToken');
};

export const getUserFromStorage = <T = any>(): T | null => {
  return safeLocalStorage.getJSON<T>('user');
};

export const setAuthData = (token: string, user: any): boolean => {
  const tokenSet = safeLocalStorage.setItem('authToken', token);
  const userSet = safeLocalStorage.setJSON('user', user);
  return tokenSet && userSet;
};

export const clearAuthData = (): boolean => {
  const tokenRemoved = safeLocalStorage.removeItem('authToken');
  const userRemoved = safeLocalStorage.removeItem('user');
  return tokenRemoved && userRemoved;
};
