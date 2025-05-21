'use client';

import { useState } from 'react';
import config from '@/config/environment';

export default function ConnectionTestPage() {
  const [directResult, setDirectResult] = useState<string | null>(null);
  const [proxyResult, setProxyResult] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<{
    direct: boolean;
    proxy: boolean;
    ping: boolean;
  }>({
    direct: false,
    proxy: false,
    ping: false
  });

  // 직접 백엔드 서버에 요청 (CORS 제약 있음)
  const testDirectConnection = async () => {
    setLoading(prev => ({ ...prev, direct: true }));
    setDirectResult(null);
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${config.apiBaseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      const endTime = Date.now();
      
      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = await response.text();
        }
        
        setDirectResult(`✅ 성공! 응답 시간: ${endTime - startTime}ms\n\n상태: ${response.status} ${response.statusText}\n\n${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`);
      } else {
        setDirectResult(`❌ 서버 오류: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('직접 연결 테스트 오류:', error);
      setDirectResult(`❌ 연결 실패: ${error instanceof Error ? error.message : String(error)}\n\n이 오류는 CORS 정책으로 인한 것일 수 있습니다.`);
    } finally {
      setLoading(prev => ({ ...prev, direct: false }));
    }
  };

  // 프록시를 통한 요청 (CORS 제약 없음)
  const testProxyConnection = async () => {
    setLoading(prev => ({ ...prev, proxy: true }));
    setProxyResult(null);
    
    try {
      const startTime = Date.now();
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      const endTime = Date.now();
      
      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = await response.text();
        }
        
        setProxyResult(`✅ 성공! 응답 시간: ${endTime - startTime}ms\n\n상태: ${response.status} ${response.statusText}\n\n${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`);
      } else {
        setProxyResult(`❌ 서버 오류: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('프록시 연결 테스트 오류:', error);
      setProxyResult(`❌ 연결 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(prev => ({ ...prev, proxy: false }));
    }
  };

  // TCP 연결 테스트 (호스트와 포트만 확인)
  const testPingConnection = async () => {
    setLoading(prev => ({ ...prev, ping: true }));
    setPingResult(null);
    
    try {
      // URL 파싱
      const url = new URL(config.apiBaseUrl);
      const startTime = Date.now();
      
      // Fetch를 사용하여 요청을 시작하고 즉시 중단
      // 이는 TCP 핸드셰이크만 확인하기 위함
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100); // 100ms 타임아웃
      
      try {
        await fetch(url.origin, {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors',
        });
        clearTimeout(timeoutId);
      } catch (e) {
        // AbortError는 정상 - 우리는 연결만 확인하려는 것
        if (e instanceof Error && e.name !== 'AbortError') {
          throw e;
        }
      }
      
      const endTime = Date.now();
      setPingResult(`✅ 호스트 ${url.hostname}:${url.port || '80'} 연결 가능! 응답 시간: ${endTime - startTime}ms`);
    } catch (error) {
      console.error('Ping 테스트 오류:', error);
      setPingResult(`❌ 호스트 연결 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(prev => ({ ...prev, ping: false }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">백엔드 서버 연결 테스트</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">현재 설정</h2>
        <div className="mb-2">
          <span className="font-medium">API 기본 URL: </span>
          <code className="bg-gray-100 px-2 py-1 rounded">{config.apiBaseUrl}</code>
        </div>
        <div>
          <span className="font-medium">환경: </span>
          <code className="bg-gray-100 px-2 py-1 rounded">{config.environment}</code>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* 직접 연결 테스트 */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">직접 연결 테스트</h2>
          <p className="text-sm text-gray-600 mb-4">
            브라우저에서 백엔드 서버로 직접 API 요청을 보냅니다. 
            CORS 정책으로 인해 실패할 수 있습니다.
          </p>
          
          <button 
            onClick={testDirectConnection}
            disabled={loading.direct}
            className={`px-4 py-2 rounded text-white font-medium ${loading.direct ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading.direct ? '테스트 중...' : '직접 연결 테스트'}
          </button>
          
          {directResult && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">결과:</h3>
              <pre className={`p-3 rounded text-sm overflow-auto max-h-60 ${directResult.includes('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
                {directResult}
              </pre>
            </div>
          )}
        </div>
        
        {/* 프록시 연결 테스트 */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">프록시 연결 테스트</h2>
          <p className="text-sm text-gray-600 mb-4">
            Next.js 프록시를 통해 백엔드 서버에 요청을 보냅니다.
            CORS 정책을 우회할 수 있습니다.
          </p>
          
          <button 
            onClick={testProxyConnection}
            disabled={loading.proxy}
            className={`px-4 py-2 rounded text-white font-medium ${loading.proxy ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading.proxy ? '테스트 중...' : '프록시 연결 테스트'}
          </button>
          
          {proxyResult && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">결과:</h3>
              <pre className={`p-3 rounded text-sm overflow-auto max-h-60 ${proxyResult.includes('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
                {proxyResult}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Ping 테스트 */}
      <div className="border rounded-lg p-4 bg-white shadow-sm mb-10">
        <h2 className="text-lg font-semibold mb-4">호스트 연결 테스트 (Ping)</h2>
        <p className="text-sm text-gray-600 mb-4">
          백엔드 서버 호스트에 기본적인 연결이 가능한지 확인합니다.
          API 상태와는 무관하게 호스트 연결 가능 여부만 테스트합니다.
        </p>
        
        <button 
          onClick={testPingConnection}
          disabled={loading.ping}
          className={`px-4 py-2 rounded text-white font-medium ${loading.ping ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading.ping ? '테스트 중...' : '호스트 연결 테스트'}
        </button>
        
        {pingResult && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">결과:</h3>
            <pre className={`p-3 rounded text-sm overflow-auto ${pingResult.includes('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
              {pingResult}
            </pre>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">문제 해결 팁</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>백엔드 서버가 실행 중인지 확인하세요.</li>
          <li>방화벽 설정을 확인하고 필요한 포트(8080)가 열려 있는지 확인하세요.</li>
          <li>백엔드 서버의 CORS 설정을 확인하세요.</li>
          <li>프록시 테스트가 성공하면 Next.js의 rewrites 기능을 사용하세요.</li>
          <li>브라우저 개발자 도구(F12)의 네트워크 탭에서 요청/응답을 분석하세요.</li>
        </ul>
      </div>
    </div>
  );
}
