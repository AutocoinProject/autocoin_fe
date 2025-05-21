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
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastCheck: string;
  port?: number;
}

export default function SystemMonitoring() {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Database', status: 'running', lastCheck: new Date().toISOString(), port: 5432 },
    { name: 'Redis Cache', status: 'running', lastCheck: new Date().toISOString(), port: 6379 },
    { name: 'API Server', status: 'running', lastCheck: new Date().toISOString(), port: 8080 },
    { name: 'WebSocket', status: 'running', lastCheck: new Date().toISOString(), port: 8081 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

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
        requestsPerMinute: Math.floor(Math.random() * 1000) + 100
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

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          시스템 모니터링
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          실시간 시스템 상태 및 성능 지표
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 시스템 통계 카드 */}
      {systemStats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* CPU 사용률 */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🖥️</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      CPU 사용률
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {systemStats.cpu.usage.toFixed(1)}%
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full ${getUsageColor(systemStats.cpu.usage)}`}
                          style={{ width: `${systemStats.cpu.usage}%` }}
                        ></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 메모리 사용률 */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      메모리 사용률
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {systemStats.memory.used.toFixed(1)}GB / {systemStats.memory.total}GB
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full ${getUsageColor(systemStats.memory.percentage)}`}
                          style={{ width: `${systemStats.memory.percentage}%` }}
                        ></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 디스크 사용률 */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💿</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      디스크 사용률
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {systemStats.disk.used}GB / {systemStats.disk.total}GB
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full ${getUsageColor(systemStats.disk.percentage)}`}
                          style={{ width: `${systemStats.disk.percentage}%` }}
                        ></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 활성 사용자 */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      활성 사용자
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {systemStats.activeUsers}명
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추가 지표 */}
      {systemStats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              시스템 정보
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">업타임</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatUptime(systemStats.uptime)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">CPU 코어</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemStats.cpu.cores}개
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">분당 요청 수</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemStats.requestsPerMinute.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* 서비스 상태 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              서비스 상태
            </h3>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">{getStatusIcon(service.status)}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </span>
                    {service.port && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        :{service.port}
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        마지막 업데이트: {new Date().toLocaleString('ko-KR')} (30초마다 자동 갱신)
      </div>
    </div>
  );
}
