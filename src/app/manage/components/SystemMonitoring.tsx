'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface SystemStats {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
  activeUsers: number;
  requestsPerMinute: number;
  responseTime: number;
  errorRate: number;
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastCheck: string;
  port?: number;
  version?: string;
  memory?: number;
  cpu?: number;
}

export default function SystemMonitoring() {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([
    { 
      name: 'Database', 
      status: 'running', 
      lastCheck: new Date().toISOString(), 
      port: 5432,
      version: '14.9',
      memory: 256,
      cpu: 12.5
    },
    { 
      name: 'Redis Cache', 
      status: 'running', 
      lastCheck: new Date().toISOString(), 
      port: 6379,
      version: '7.0',
      memory: 64,
      cpu: 3.2
    },
    { 
      name: 'API Server', 
      status: 'running', 
      lastCheck: new Date().toISOString(), 
      port: 8080,
      version: '1.0.0',
      memory: 512,
      cpu: 25.8
    },
    { 
      name: 'WebSocket', 
      status: 'running', 
      lastCheck: new Date().toISOString(), 
      port: 8081,
      version: '1.0.0',
      memory: 128,
      cpu: 8.1
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(30);

  useEffect(() => {
    fetchSystemStats();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchSystemStats, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // 실제 API가 없으므로 모의 데이터 사용
      const mockStats: SystemStats = {
        cpu: {
          usage: Math.random() * 100,
          cores: 8
        },
        memory: {
          used: 4.2,
          total: 16,
          percentage: (4.2 / 16) * 100
        },
        disk: {
          used: 120,
          total: 500,
          percentage: (120 / 500) * 100
        },
        uptime: Date.now() - (Math.random() * 86400000 * 7), // 최대 7일
        activeUsers: Math.floor(Math.random() * 100) + 10,
        requestsPerMinute: Math.floor(Math.random() * 1000) + 100,
        responseTime: Math.random() * 200 + 50,
        errorRate: Math.random() * 5
      };
      
      setSystemStats(mockStats);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch system stats:', err);
      setError('시스템 상태를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (timestamp: number) => {
    const uptime = Date.now() - timestamp;
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}일 ${hours}시간 ${minutes}분`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'stopped':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return '🟢';
      case 'stopped':
        return '🟡';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const handleServiceAction = async (serviceName: string, action: 'start' | 'stop' | 'restart') => {
    console.log(`${action} ${serviceName}`);
    // 실제 서비스 제어 로직 구현
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            시스템 모니터링
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            실시간 시스템 상태 및 성능 지표
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">자동 새로고침</span>
          </label>
          <button
            onClick={fetchSystemStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            업데이트
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 성능 지표 및 서비스 상태 */}
      {systemStats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 성능 지표 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              성능 지표
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemStats.activeUsers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">활성 사용자</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemStats.requestsPerMinute.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">분당 요청 수</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemStats.responseTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">평균 응답시간</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemStats.errorRate.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">오류율</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">시스템 업타임</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatUptime(systemStats.uptime)}
                </span>
              </div>
            </div>
          </div>

          {/* 서비스 상태 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              서비스 상태
            </h3>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="mr-2">{getStatusIcon(service.status)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {service.version && `v${service.version} • `}
                          Port {service.port}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                      <div className="flex space-x-1">
                        {service.status !== 'running' && (
                          <button
                            onClick={() => handleServiceAction(service.name, 'start')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                            title="시작"
                          >
                            ▶️
                          </button>
                        )}
                        {service.status === 'running' && (
                          <button
                            onClick={() => handleServiceAction(service.name, 'restart')}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                            title="재시작"
                          >
                            🔄
                          </button>
                        )}
                        <button
                          onClick={() => handleServiceAction(service.name, 'stop')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                          title="정지"
                        >
                          ⏹️
                        </button>
                      </div>
                    </div>
                  </div>
                  {service.memory !== undefined && service.cpu !== undefined && (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">메모리</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatBytes(service.memory * 1024 * 1024)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">CPU</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {service.cpu.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    마지막 확인: {new Date(service.lastCheck).toLocaleString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 추가 시스템 정보 */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          시스템 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">하드웨어</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">CPU 코어</dt>
                <dd className="text-gray-900 dark:text-white">{systemStats?.cpu.cores}개</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">총 메모리</dt>
                <dd className="text-gray-900 dark:text-white">{systemStats?.memory.total}GB</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">총 저장공간</dt>
                <dd className="text-gray-900 dark:text-white">{systemStats?.disk.total}GB</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">환경 정보</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">운영체제</dt>
                <dd className="text-gray-900 dark:text-white">Ubuntu 22.04</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Node.js</dt>
                <dd className="text-gray-900 dark:text-white">v18.17.0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Docker</dt>
                <dd className="text-gray-900 dark:text-white">24.0.5</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">보안</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">방화벽</dt>
                <dd className="text-green-600 dark:text-green-400">활성</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">SSL 인증서</dt>
                <dd className="text-green-600 dark:text-green-400">유효</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">백업</dt>
                <dd className="text-green-600 dark:text-green-400">최신</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        마지막 업데이트: {new Date().toLocaleString('ko-KR')} 
        {autoRefresh && ` (${refreshInterval}초마다 자동 갱신)`}
      </div>
    </div>
  );
}