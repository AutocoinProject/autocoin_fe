'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  service: string;
  userId?: number;
  ip?: string;
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    level: 'ALL',
    service: 'ALL',
    searchTerm: ''
  });
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 5000); // 5초마다 자동 새로고침
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchLogs = async () => {
    try {
      // 실제 API가 없으므로 모의 데이터 생성
      const mockLogs: LogEntry[] = Array.from({ length: 100 }, (_, i) => {
        const levels: LogEntry['level'][] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
        const services = ['auth-service', 'api-server', 'database', 'cache'];
        const messages = [
          'User login successful',
          'Database connection established',
          'Cache miss for key: user_session_123',
          'API request processed',
          'Authentication failed for user',
          'System backup completed',
          'Memory usage threshold exceeded',
          'New user registration',
          'File upload completed',
          'Scheduled task executed'
        ];

        return {
          id: `log-${i}`,
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          service: services[Math.floor(Math.random() * services.length)],
          userId: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : undefined,
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`
        };
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setLogs(mockLogs);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError('로그를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter.level !== 'ALL' && log.level !== filter.level) return false;
    if (filter.service !== 'ALL' && log.service !== filter.service) return false;
    if (filter.searchTerm && !log.message.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
    return true;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'INFO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DEBUG':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return '🔴';
      case 'WARN':
        return '🟡';
      case 'INFO':
        return '🟢';
      case 'DEBUG':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const clearLogs = () => {
    if (confirm('모든 로그를 삭제하시겠습니까?')) {
      setLogs([]);
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
      {/* 헤더 및 필터 */}
      <div>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              로그 뷰어
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              시스템 로그 및 오류 추적 (총 {filteredLogs.length}개)
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                autoRefresh
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {autoRefresh ? '자동 새로고침 ON' : '자동 새로고침 OFF'}
            </button>
            <button
              onClick={exportLogs}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              내보내기
            </button>
            <button
              onClick={clearLogs}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 필터 */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              레벨
            </label>
            <select
              value={filter.level}
              onChange={(e) => setFilter({ ...filter, level: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">모든 레벨</option>
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              서비스
            </label>
            <select
              value={filter.service}
              onChange={(e) => setFilter({ ...filter, service: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">모든 서비스</option>
              <option value="auth-service">Auth Service</option>
              <option value="api-server">API Server</option>
              <option value="database">Database</option>
              <option value="cache">Cache</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              검색
            </label>
            <input
              type="text"
              placeholder="메시지 검색..."
              value={filter.searchTerm}
              onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 로그 테이블 */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="max-h-96 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <li key={log.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3">{getLevelIcon(log.level)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {log.service}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {log.message}
                      </p>
                      {(log.userId || log.ip) && (
                        <div className="mt-1 flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          {log.userId && <span>User ID: {log.userId}</span>}
                          {log.ip && <span>IP: {log.ip}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">표시할 로그가 없습니다.</p>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {autoRefresh && '자동 새로고침 활성화 (5초마다 업데이트)'} 
        {!autoRefresh && '수동 새로고침 모드'}
      </div>
    </div>
  );
}
