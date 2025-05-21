'use client';

import React from 'react';

export default function ApiTestPage() {
  // 간단한 상태와 기능 추가
  const [testResult, setTestResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // API 테스트 함수
  const testApi = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.text();
      setTestResult(data || 'API 연결 성공! (응답 데이터 없음)');
    } catch (err) {
      console.error('API 테스트 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">백엔드 API 테스트</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium mb-2">API 연결 테스트</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          백엔드 API 서버와의 연결 상태를 확인합니다. API 서버가 실행 중인지 확인하세요.
        </p>
        <button
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '테스트 중...' : 'API 연결 테스트'}
        </button>
      </div>
      
      {testResult && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">성공!</h3>
          <pre className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-auto text-sm">
            {testResult}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">오류 발생</h3>
          <pre className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-auto text-sm text-red-600 dark:text-red-400">
            {error}
          </pre>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>가능한 원인:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>백엔드 API 서버가 실행 중이지 않습니다.</li>
              <li>CORS 설정이 올바르지 않습니다.</li>
              <li>네트워크 연결 문제가 있습니다.</li>
              <li>환경 변수 설정이 올바르지 않습니다.</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2">API 설정 정보</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">API Base URL: </span>
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
              {process.env.NEXT_PUBLIC_API_BASE_URL || '설정되지 않음 (기본값 사용)'}
            </code>
          </p>
          <p>
            <span className="font-medium">환경: </span>
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
              {process.env.NODE_ENV}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}