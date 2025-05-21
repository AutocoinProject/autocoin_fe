'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface DatabaseStats {
  totalUsers: number;
  totalBots: number;
  totalTransactions: number;
  totalApiKeys: number;
  databaseSize: string;
  indexSize: string;
  connectionCount: number;
  slowQueries: number;
  tableStats: Array<{
    tableName: string;
    rowCount: number;
    size: string;
    indexSize: string;
    lastVacuum?: string;
  }>;
  performanceMetrics: {
    avgQueryTime: number;
    cacheHitRatio: number;
    transactionsPerSecond: number;
    connectionUtilization: number;
  };
}

interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  type: 'full' | 'incremental' | 'differential';
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  retentionDays: number;
}

interface QueryAnalysis {
  query: string;
  avgTime: number;
  execCount: number;
  totalTime: number;
  lastExecuted: string;
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [slowQueries, setSlowQueries] = useState<QueryAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'backup' | 'maintenance' | 'queries'>('stats');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState('daily');

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // 모의 데이터 - 실제 환경에서는 실제 API 호출
      const mockStats: DatabaseStats = {
        totalUsers: 1247,
        totalBots: 89,
        totalTransactions: 25847,
        totalApiKeys: 156,
        databaseSize: '2.4 GB',
        indexSize: '412 MB',
        connectionCount: 23,
        slowQueries: 5,
        tableStats: [
          { tableName: 'users', rowCount: 1247, size: '45 MB', indexSize: '12 MB', lastVacuum: '2024-01-15 02:00:00' },
          { tableName: 'bots', rowCount: 89, size: '8 MB', indexSize: '2 MB', lastVacuum: '2024-01-15 02:15:00' },
          { tableName: 'transactions', rowCount: 25847, size: '850 MB', indexSize: '180 MB', lastVacuum: '2024-01-15 02:30:00' },
          { tableName: 'api_keys', rowCount: 156, size: '3 MB', indexSize: '1 MB', lastVacuum: '2024-01-15 02:45:00' },
          { tableName: 'trades', rowCount: 158963, size: '1.2 GB', indexSize: '200 MB', lastVacuum: '2024-01-15 03:00:00' },
          { tableName: 'audit_logs', rowCount: 45782, size: '120 MB', indexSize: '15 MB', lastVacuum: '2024-01-15 03:15:00' },
        ],
        performanceMetrics: {
          avgQueryTime: 45.2,
          cacheHitRatio: 98.5,
          transactionsPerSecond: 150,
          connectionUtilization: 46
        }
      };

      const mockBackups: BackupInfo[] = [
        {
          id: '1',
          filename: 'autocoin_full_2024-01-15_02-00.sql',
          size: '1.8 GB',
          type: 'full',
          createdAt: '2024-01-15T02:00:00Z',
          status: 'completed',
          retentionDays: 30
        },
        {
          id: '2',
          filename: 'autocoin_incremental_2024-01-14_02-00.sql',
          size: '245 MB',
          type: 'incremental',
          createdAt: '2024-01-14T02:00:00Z',
          status: 'completed',
          retentionDays: 7
        },
        {
          id: '3',
          filename: 'autocoin_full_2024-01-13_02-00.sql',
          size: '1.7 GB',
          type: 'full',
          createdAt: '2024-01-13T02:00:00Z',
          status: 'completed',
          retentionDays: 30
        }
      ];

      const mockSlowQueries: QueryAnalysis[] = [
        {
          query: 'SELECT u.*, COUNT(t.*) FROM users u LEFT JOIN transactions t...',
          avgTime: 2450,
          execCount: 25,
          totalTime: 61250,
          lastExecuted: '2024-01-15T10:30:00Z'
        },
        {
          query: 'UPDATE bots SET last_heartbeat = NOW() WHERE id IN (...)',
          avgTime: 1800,
          execCount: 89,
          totalTime: 160200,
          lastExecuted: '2024-01-15T10:25:00Z'
        }
      ];

      setStats(mockStats);
      setBackups(mockBackups);
      setSlowQueries(mockSlowQueries);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch database data:', err);
      setError('데이터베이스 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (type: 'full' | 'incremental' = 'full') => {
    if (!confirm(`${type === 'full' ? '전체' : '증분'} 백업을 생성하시겠습니까? 시간이 오래 걸릴 수 있습니다.`)) return;

    try {
      setBackupLoading(true);
      const token = localStorage.getItem('authToken');
      
      // 모의 백업 생성
      setTimeout(() => {
        const newBackup: BackupInfo = {
          id: Date.now().toString(),
          filename: `autocoin_${type}_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().slice(0, 5).replace(':', '-')}.sql`,
          size: type === 'full' ? '1.8 GB' : '250 MB',
          type,
          createdAt: new Date().toISOString(),
          status: 'completed',
          retentionDays: type === 'full' ? 30 : 7
        };
        setBackups(prev => [newBackup, ...prev]);
        setBackupLoading(false);
        alert('백업이 성공적으로 완료되었습니다.');
      }, 3000);
      
    } catch (err) {
      console.error('Failed to create backup:', err);
      alert('백업 생성에 실패했습니다.');
      setBackupLoading(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('이 백업을 삭제하시겠습니까?')) return;

    try {
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
      alert('백업이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete backup:', err);
      alert('백업 삭제에 실패했습니다.');
    }
  };

  const downloadBackup = async (backupId: string, filename: string) => {
    try {
      alert(`${filename} 다운로드가 시작됩니다.`);
      // 실제 환경에서는 파일 다운로드 로직 구현
    } catch (err) {
      console.error('Failed to download backup:', err);
      alert('백업 다운로드에 실패했습니다.');
    }
  };

  const optimizeDatabase = async () => {
    if (!confirm('데이터베이스를 최적화하시겠습니까? 시스템 성능에 일시적으로 영향을 줄 수 있습니다.')) return;

    try {
      const token = localStorage.getItem('authToken');
      // 모의 최적화 작업
      alert('데이터베이스 최적화가 시작되었습니다.');
      
      setTimeout(() => {
        alert('데이터베이스 최적화가 완료되었습니다.');
        fetchDatabaseData();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to optimize database:', err);
      alert('데이터베이스 최적화에 실패했습니다.');
    }
  };

  const runVacuum = async (tableName?: string) => {
    const target = tableName || '전체 데이터베이스';
    if (!confirm(`${target}에 대해 VACUUM을 실행하시겠습니까?`)) return;

    try {
      alert(`${target} VACUUM이 시작되었습니다.`);
      
      setTimeout(() => {
        alert(`${target} VACUUM이 완료되었습니다.`);
        fetchDatabaseData();
      }, 1500);
      
    } catch (err) {
      console.error('Failed to run vacuum:', err);
      alert('VACUUM 실행에 실패했습니다.');
    }
  };

  const analyzeQuery = async (query: string) => {
    try {
      alert(`쿼리 분석이 시작됩니다:\n${query.substring(0, 100)}...`);
      // 실제 환경에서는 쿼리 분석 로직 구현
    } catch (err) {
      console.error('Failed to analyze query:', err);
      alert('쿼리 분석에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getBackupTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'incremental':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'differential':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const tabs = [
    { id: 'stats' as const, name: '데이터베이스 통계', icon: '📊' },
    { id: 'backup' as const, name: '백업 관리', icon: '💾' },
    { id: 'maintenance' as const, name: '유지보수', icon: '🔧' },
    { id: 'queries' as const, name: '쿼리 분석', icon: '🔍' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 데이터베이스 통계 탭 */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* 기본 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 사용자</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white">🤖</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 봇</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.totalBots.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white">💳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 거래</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.totalTransactions.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white">💾</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">DB 크기</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.databaseSize}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 성능 지표 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">성능 지표</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.performanceMetrics.avgQueryTime}ms</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">평균 쿼리 시간</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.performanceMetrics.cacheHitRatio}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">캐시 적중률</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.performanceMetrics.transactionsPerSecond}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">초당 트랜잭션</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.performanceMetrics.connectionUtilization}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">연결 사용률</div>
              </div>
            </div>
          </div>

          {/* 테이블별 통계 */}
          <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">테이블별 통계</h3>
              <button
                onClick={() => runVacuum()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                전체 VACUUM 실행
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">테이블명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">행 수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">데이터 크기</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">인덱스 크기</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">마지막 VACUUM</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작업</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {stats.tableStats.map((table, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{table.tableName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{table.rowCount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{table.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{table.indexSize}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {table.lastVacuum ? formatDate(table.lastVacuum) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => runVacuum(table.tableName)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          VACUUM
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 백업 관리 탭 */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* 백업 설정 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">백업 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">자동 백업</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">정기적으로 자동 백업 실행</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackupEnabled}
                  onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">백업 주기</label>
                <select
                  value={backupSchedule}
                  onChange={(e) => setBackupSchedule(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                >
                  <option value="hourly">매시간</option>
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                </select>
              </div>
            </div>
          </div>

          {/* 백업 생성 */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">백업 파일 목록</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => createBackup('incremental')}
                disabled={backupLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                증분 백업
              </button>
              <button
                onClick={() => createBackup('full')}
                disabled={backupLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {backupLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    백업 중...
                  </>
                ) : (
                  '전체 백업'
                )}
              </button>
            </div>
          </div>

          {/* 백업 목록 */}
          <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {backups.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">백업 파일이 없습니다.</li>
              ) : (
                backups.map((backup) => (
                  <li key={backup.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-gray-700 dark:text-gray-300">💾</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{backup.filename}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {backup.size} • {formatDate(backup.createdAt)} • 보관 {backup.retentionDays}일
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBackupTypeColor(backup.type)}`}>
                              {backup.type === 'full' ? '전체' : backup.type === 'incremental' ? '증분' : '차등'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(backup.status)}`}>
                              {backup.status === 'completed' ? '완료' : backup.status === 'in_progress' ? '진행중' : backup.status === 'failed' ? '실패' : '예약됨'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {backup.status === 'completed' && (
                          <>
                            <button
                              onClick={() => downloadBackup(backup.id, backup.filename)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                              title="다운로드"
                            >
                              ⬇️
                            </button>
                            <button
                              onClick={() => deleteBackup(backup.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                              title="삭제"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 유지보수 탭 */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">데이터베이스 최적화</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                인덱스를 재구성하고 통계를 업데이트하여 쿼리 성능을 향상시킵니다.
              </p>
              <button
                onClick={optimizeDatabase}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                최적화 실행
              </button>
            </div>

            <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">무결성 검사</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                데이터베이스의 무결성을 확인하고 손상된 데이터를 탐지합니다.
              </p>
              <button
                onClick={() => alert('무결성 검사가 시작됩니다.')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
              >
                무결성 검사
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">유지보수 주의사항</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>유지보수 작업은 시스템 성능에 일시적으로 영향을 줄 수 있습니다</li>
                    <li>사용량이 적은 시간대에 실행하는 것을 권장합니다</li>
                    <li>중요한 작업 전에는 반드시 백업을 생성하세요</li>
                    <li>VACUUM 작업은 테이블 잠금을 발생시킬 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 쿼리 분석 탭 */}
      {activeTab === 'queries' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">느린 쿼리 분석</h3>
            <div className="space-y-4">
              {slowQueries.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">현재 느린 쿼리가 없습니다.</p>
              ) : (
                slowQueries.map((query, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {query.query}
                        </div>
                      </div>
                      <button
                        onClick={() => analyzeQuery(query.query)}
                        className="ml-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                      >
                        분석하기
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">평균 시간</div>
                        <div className="font-medium text-gray-900 dark:text-white">{query.avgTime}ms</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">실행 횟수</div>
                        <div className="font-medium text-gray-900 dark:text-white">{query.execCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">총 시간</div>
                        <div className="font-medium text-gray-900 dark:text-white">{(query.totalTime / 1000).toFixed(1)}s</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">마지막 실행</div>
                        <div className="font-medium text-gray-900 dark:text-white">{formatDate(query.lastExecuted)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">쿼리 성능 팁</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">인덱스 최적화</div>
                  <div className="text-gray-500 dark:text-gray-400">자주 사용되는 WHERE, JOIN, ORDER BY 절에 적절한 인덱스를 추가하세요.</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">쿼리 구조 개선</div>
                  <div className="text-gray-500 dark:text-gray-400">N+1 문제를 피하고, 불필요한 JOIN을 제거하세요.</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">페이지네이션 사용</div>
                  <div className="text-gray-500 dark:text-gray-400">대량의 데이터를 조회할 때는 LIMIT과 OFFSET을 사용하세요.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
