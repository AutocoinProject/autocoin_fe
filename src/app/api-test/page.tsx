'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState(config.apiBaseUrl);
  const [endpoint, setEndpoint] = useState('/api/health');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState('Unknown');
  const [healthLoading, setHealthLoading] = useState(false);

  // 페이지 로드 시 건강 상태 확인
  useEffect(() => {
    checkHealth();
  }, []);

  // 건강 상태 확인 함수
  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/health`);
      if (response.ok) {
        setHealthStatus('Online');
      } else {
        setHealthStatus(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setHealthStatus(`Offline or CORS error: ${err.message}`);
    } finally {
      setHealthLoading(false);
    }
  };

  // API 요청 함수
  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log(`Sending ${method} request to: ${apiUrl}${endpoint}`);
      
      // 요청 설정
      const config = {
        method,
        url: `${apiUrl}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      // POST, PUT 메소드에 본문 추가
      if (method === 'POST' || method === 'PUT') {
        try {
          config.data = JSON.parse(requestBody);
        } catch (parseError) {
          setError(`JSON 파싱 오류: ${parseError.message}`);
          setLoading(false);
          return;
        }
      }
      
      const response = await axios(config);
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      console.log('Response received:', response);
    } catch (err) {
      console.error('Request failed:', err);
      
      if (axios.isAxiosError(err)) {
        setError({
          message: err.message,
          code: err.code,
          response: err.response ? {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          } : null,
          request: err.request ? 'Request sent but no response received' : null,
          config: err.config
        });
      } else {
        setError({
          message: err.message,
          stack: err.stack
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">백엔드 API 테스트</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">서버 상태</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            healthStatus === 'Online' ? 'bg-green-500' : 
            healthStatus === 'Unknown' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span>{healthLoading ? '확인 중...' : healthStatus}</span>
          <button 
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded text-sm"
            onClick={checkHealth}
            disabled={healthLoading}
          >
            {healthLoading ? '확인 중...' : '상태 확인'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-medium">API URL</label>
          <input 
            type="text" 
            value={apiUrl} 
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">엔드포인트</label>
          <input 
            type="text" 
            value={endpoint} 
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">메소드</label>
        <div className="flex space-x-4">
          {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <button 
              key={m}
              className={`px-4 py-2 rounded ${
                method === m 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      {(method === 'POST' || method === 'PUT') && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">요청 본문 (JSON)</label>
          <textarea 
            value={requestBody} 
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full p-2 border rounded font-mono h-40"
            placeholder="{\n  \"key\": \"value\"\n}"
          />
        </div>
      )}
      
      <div className="mb-8">
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={sendRequest}
          disabled={loading}
        >
          {loading ? '요청 중...' : '요청 보내기'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 응답 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">응답</h2>
          {loading ? (
            <div className="p-4 border rounded bg-gray-50">요청 중...</div>
          ) : response ? (
            <div className="p-4 border rounded bg-green-50">
              <div className="mb-2">
                <span className="font-medium">상태: </span>
                <span className="inline-block px-2 py-1 bg-green-100 rounded">
                  {response.status} {response.statusText}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-medium">헤더:</span>
                <pre className="mt-1 p-2 bg-white rounded overflow-auto text-xs">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>
              <div>
                <span className="font-medium">데이터:</span>
                <pre className="mt-1 p-2 bg-white rounded overflow-auto text-xs">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded bg-gray-50 text-gray-500">
              요청을 보내면 여기에 응답이 표시됩니다.
            </div>
          )}
        </div>
        
        {/* 에러 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">오류</h2>
          {error ? (
            <div className="p-4 border rounded bg-red-50">
              <div className="mb-2">
                <span className="font-medium">메시지: </span>
                <span className="text-red-600">{error.message}</span>
              </div>
              {error.code && (
                <div className="mb-2">
                  <span className="font-medium">코드: </span>
                  <span className="inline-block px-2 py-1 bg-red-100 rounded">
                    {error.code}
                  </span>
                </div>
              )}
              {error.response && (
                <div className="mb-4">
                  <span className="font-medium">응답:</span>
                  <pre className="mt-1 p-2 bg-white rounded overflow-auto text-xs">
                    {JSON.stringify(error.response, null, 2)}
                  </pre>
                </div>
              )}
              {error.config && (
                <div>
                  <span className="font-medium">요청 설정:</span>
                  <pre className="mt-1 p-2 bg-white rounded overflow-auto text-xs">
                    {JSON.stringify(error.config, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border rounded bg-gray-50 text-gray-500">
              오류가 발생하면 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
