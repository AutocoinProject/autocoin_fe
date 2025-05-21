'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface DatabaseStats {
  totalUsers: number;
  totalBots: number;
  totalTransactions: number;
  databaseSize: string;
  tableStats: Array<{
    tableName: string;
    rowCount: number;
    size: string;
  }>;
}

interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'backup' | 'maintenance'>('stats');

  useEffect(() => {
    fetchDatabaseStats();
    fetchBackups();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${config.apiBaseUrl}/api/v1/admin/database/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch database stats:', err);
      setError('데이터베이스 통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${config.apiBaseUrl}/api/v1/admin/database/backups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBackups(response.data);
    } catch (err) {
      console.error('Failed to fetch backups:', err);
    }
  };

  const createBackup = async () => {
    if (!confirm('데이터베이스 백업을 생성하시겠습니까? 시간이 오래 걸릴 수 있습니다.')) return;

    try {
      setBackupLoading(true);
      const token = localStorage.getItem('authToken');
      await axios.post(`${config.apiBaseUrl}/api/v1/admin/database/backup`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('백업이 시작되었습니다. 완료까지 시간이 걸릴 수 있습니다.');
      fetchBackups();
    } catch (err) {
      console.error('Failed to create backup:', err);
      alert('백업 생성에 실패했습니다.');
    } finally {
      setBackupLoading(false);
    }
  };

  const downloadBackup = async (backupId: string, filename: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${config.apiBaseUrl}/api/v1/admin/database/backup/${backupId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download backup:', err);
      alert('백업 다운로드에 실패했습니다.');
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('이 백업을 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${config.apiBaseUrl}/api/v1/admin/database/backup/${backupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchBackups();
    } catch (err) {
      console.error('Failed to delete backup:', err);
      alert('백업 삭제에 실패했습니다.');
    }
  };

  const optimizeDatabase = async () => {
    if (!confirm('데이터베이스를 최적화하시겠습니까? 시스템 성능에 일시적으로 영향을 줄 수 있습니다.')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${config.apiBaseUrl}/api/v1/admin/database/optimize`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('데이터베이스 최적화가 완료되었습니다.');
      fetchDatabaseStats();
    } catch (err) {
      console.error('Failed to optimize database:', err);
      alert('데이터베이스 최적화에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const tabs = [
    { id: 'stats' as const, name: '데이터베이스 통계', icon: '📊' },
    { id: 'backup' as const, name: '백업 관리', icon: '💾' },
    { id: 'maintenance' as const, name: '유지보수', icon: '🔧' },
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        총 사용자
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.totalUsers.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white">🤖</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        총 봇
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.totalBots.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white">💳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        총 거래
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.totalTransactions.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white">💾</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        DB 크기
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.databaseSize}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 테이블별 통계 */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                테이블별 통계
              </h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      테이블명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      행 수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      크기
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.tableStats.map((table, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {table.tableName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {table.rowCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {table.size}
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              백업 파일 목록
            </h3>
            <button
              onClick={createBackup}
              disabled={backupLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {backupLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  백업 중...
                </>
              ) : (
                '새 백업 생성'
              )}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {backups.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  백업 파일이 없습니다.
                </li>
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
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {backup.filename}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {backup.size} • {formatDate(backup.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(backup.status)}`}>
                          {backup.status === 'completed' && '완료'}
                          {backup.status === 'in_progress' && '진행중'}
                          {backup.status === 'failed' && '실패'}
                        </span>
                        {backup.status === 'completed' && (
                          <>
                            <button
                              onClick={() => downloadBackup(backup.id, backup.filename)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                            >
                              다운로드
                            </button>
                            <button
                              onClick={() => deleteBackup(backup.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                            >
                              삭제
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
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                데이터베이스 최적화
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>
                  데이터베이스를 최적화하여 성능을 향상시킵니다. 이 작업은 시간이 걸릴 수 있으며, 
                  시스템 성능에 일시적으로 영향을 줄 수 있습니다.
                </p>
              </div>
              <div className="mt-5">
                <button
                  onClick={optimizeDatabase}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  데이터베이스 최적화 실행
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  주의사항
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>데이터베이스 최적화는 시스템 리소스를 많이 사용합니다.</li>
                    <li>작업 중에는 시스템 응답 속도가 느려질 수 있습니다.</li>
                    <li>가능하면 사용자가 적은 시간대에 실행하시기 바랍니다.</li>
                    <li>작업 전에 백업을 생성하는 것을 권장합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
