'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface ApiKey {
  id: number;
  name: string;
  exchange: 'BINANCE' | 'UPBIT' | 'BITHUMB';
  keyId: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
}

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${config.apiBaseUrl}/api/v1/api-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setApiKeys(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      setError('API 키 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (keyId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`${config.apiBaseUrl}/api/v1/api-keys/${keyId}/status`, {
        isActive: !isActive
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchApiKeys();
    } catch (err) {
      console.error('Failed to toggle API key status:', err);
      alert('API 키 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteKey = async (keyId: number) => {
    if (!confirm('정말로 이 API 키를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${config.apiBaseUrl}/api/v1/api-keys/${keyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchApiKeys();
    } catch (err) {
      console.error('Failed to delete API key:', err);
      alert('API 키 삭제에 실패했습니다.');
    }
  };

  const getExchangeColor = (exchange: string) => {
    switch (exchange) {
      case 'BINANCE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'UPBIT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'BITHUMB':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 4) + '*'.repeat(Math.max(0, key.length - 8)) + key.slice(-4);
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
      {/* 헤더 */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            API 키 관리
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            거래소 API 키를 안전하게 관리하세요
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            새 API 키 추가
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 보안 안내 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              보안 주의사항
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>API 키는 암호화되어 안전하게 저장됩니다.</li>
                <li>불필요한 권한은 부여하지 마세요.</li>
                <li>API 키가 유출되었다고 생각되면 즉시 삭제하고 거래소에서 새로 발급받으세요.</li>
                <li>정기적으로 API 키 사용 기록을 확인하세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* API 키 목록 */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {apiKeys.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">🔑</div>
              <p className="text-gray-500 dark:text-gray-400">아직 등록된 API 키가 없습니다.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                거래소 API 키를 추가하여 자동 거래를 시작하세요.
              </p>
            </li>
          ) : (
            apiKeys.map((apiKey) => (
              <li key={apiKey.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🔑</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {apiKey.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {maskApiKey(apiKey.keyId)}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        생성일: {formatDate(apiKey.createdAt)}
                        {apiKey.lastUsed && ` • 마지막 사용: ${formatDate(apiKey.lastUsed)}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExchangeColor(apiKey.exchange)}`}>
                        {apiKey.exchange}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          apiKey.isActive 
                            ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
                            : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
                        }`}>
                          {apiKey.isActive ? '활성' : '비활성'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(apiKey.id, apiKey.isActive)}
                        className={`text-sm ${
                          apiKey.isActive
                            ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                      >
                        {apiKey.isActive ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedKey(apiKey);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
                {apiKey.permissions.length > 0 && (
                  <div className="mt-2 ml-14">
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* API 키 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                새 API 키 추가
              </h3>
              <ApiKeyCreateForm 
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                  setShowCreateModal(false);
                  fetchApiKeys();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* API 키 수정 모달 */}
      {showEditModal && selectedKey && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                API 키 수정 - {selectedKey.name}
              </h3>
              <ApiKeyEditForm 
                apiKey={selectedKey}
                onClose={() => {
                  setShowEditModal(false);
                  setSelectedKey(null);
                }}
                onSuccess={() => {
                  setShowEditModal(false);
                  setSelectedKey(null);
                  fetchApiKeys();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// API 키 생성 폼 컴포넌트
interface ApiKeyCreateFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function ApiKeyCreateForm({ onClose, onSuccess }: ApiKeyCreateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    exchange: 'BINANCE' as 'BINANCE' | 'UPBIT' | 'BITHUMB',
    apiKey: '',
    secretKey: '',
    permissions: ['SPOT_TRADING'],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${config.apiBaseUrl}/api/v1/api-keys`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to create API key:', err);
      alert('API 키 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          이름 *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="예: 메인 트레이딩"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          거래소 *
        </label>
        <select
          value={formData.exchange}
          onChange={(e) => setFormData(prev => ({ ...prev, exchange: e.target.value as any }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          <option value="BINANCE">바이낸스</option>
          <option value="UPBIT">업비트</option>
          <option value="BITHUMB">빗썸</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          API 키 *
        </label>
        <input
          type="text"
          required
          value={formData.apiKey}
          onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          시크릿 키 *
        </label>
        <input
          type="password"
          required
          value={formData.secretKey}
          onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          권한
        </label>
        <div className="space-y-2">
          {['SPOT_TRADING', 'MARGIN_TRADING', 'FUTURES_TRADING', 'READ_ONLY'].map((permission) => (
            <div key={permission} className="flex items-center">
              <input
                type="checkbox"
                id={permission}
                checked={formData.permissions.includes(permission)}
                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={permission} className="ml-2 block text-sm text-gray-900 dark:text-white">
                {permission.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? '생성 중...' : '생성'}
        </button>
      </div>
    </form>
  );
}

// API 키 수정 폼 컴포넌트
interface ApiKeyEditFormProps {
  apiKey: ApiKey;
  onClose: () => void;
  onSuccess: () => void;
}

function ApiKeyEditForm({ apiKey, onClose, onSuccess }: ApiKeyEditFormProps) {
  const [formData, setFormData] = useState({
    name: apiKey.name,
    permissions: apiKey.permissions,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${config.apiBaseUrl}/api/v1/api-keys/${apiKey.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to update API key:', err);
      alert('API 키 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          이름 *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          거래소
        </label>
        <input
          type="text"
          value={apiKey.exchange}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          권한
        </label>
        <div className="space-y-2">
          {['SPOT_TRADING', 'MARGIN_TRADING', 'FUTURES_TRADING', 'READ_ONLY'].map((permission) => (
            <div key={permission} className="flex items-center">
              <input
                type="checkbox"
                id={permission}
                checked={formData.permissions.includes(permission)}
                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={permission} className="ml-2 block text-sm text-gray-900 dark:text-white">
                {permission.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}
