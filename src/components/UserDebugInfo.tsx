'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { getAuthToken, getUserFromStorage, clearAuthData } from '@/lib/localStorage';

export default function UserDebugInfo() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  const token = getAuthToken();
  const userFromStorage = getUserFromStorage();

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50"
        title="사용자 정보 디버깅"
      >
        👤
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">User Debug Info</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <strong>인증 상태:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isLoading ? 'Loading...' : (isAuthenticated ? 'Authenticated' : 'Not Authenticated')}
          </span>
        </div>

        <div>
          <strong>토큰 존재:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            token 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {token ? 'Yes' : 'No'}
          </span>
        </div>

        <div>
          <strong>Context User:</strong>
          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <strong>LocalStorage User:</strong>
          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
            {userFromStorage || 'None'}
          </pre>
        </div>

        <div>
          <strong>Token (first 50 chars):</strong>
          <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs break-all">
            {token ? `${token.substring(0, 50)}...` : 'None'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => {
            console.log('User from Context:', user);
            console.log('Token:', token);
            console.log('User from Storage:', userFromStorage);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Log to Console
        </button>
        <button
          onClick={() => {
            clearAuthData();
            window.location.reload();
          }}
          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Clear Auth
        </button>
      </div>
    </div>
  );
}
