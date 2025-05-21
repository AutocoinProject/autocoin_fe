'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import config from '@/config/environment';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  allowedIps: string[];
  apiRateLimit: number;
}

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  isCurrentSession: boolean;
  lastActivity: string;
  createdAt: string;
}

interface LoginHistory {
  id: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}

export default function SecuritySettings() {
  const { user } = useAuth();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'sessions' | 'history'>('settings');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const [settingsRes, sessionsRes, historyRes] = await Promise.all([
        axios.get(`${config.apiBaseUrl}/api/v1/security/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${config.apiBaseUrl}/api/v1/security/sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${config.apiBaseUrl}/api/v1/security/login-history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setSecuritySettings(settingsRes.data);
      setSessions(sessionsRes.data);
      setLoginHistory(historyRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch security data:', err);
      setError('보안 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (updatedSettings: Partial<SecuritySettings>) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${config.apiBaseUrl}/api/v1/security/settings`, 
        { ...securitySettings, ...updatedSettings }, 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setSecuritySettings(response.data);
      setSuccess('보안 설정이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      console.error('Failed to update security settings:', err);
      setError('보안 설정 업데이트에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${config.apiBaseUrl}/api/v1/security/sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSecurityData();
    } catch (err) {
      console.error('Failed to logout session:', err);
      alert('세션 로그아웃에 실패했습니다.');
    }
  };

  const handleLogoutAllSessions = async () => {
    if (!confirm('모든 다른 세션에서 로그아웃하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${config.apiBaseUrl}/api/v1/security/sessions/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSecurityData();
    } catch (err) {
      console.error('Failed to logout all sessions:', err);
      alert('모든 세션 로그아웃에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getLocationFromIP = (ip: string) => {
    // 실제로는 IP를 기반으로 위치를 조회하는 서비스를 사용
    return `위치 정보 (${ip})`;
  };

  const tabs = [
    { id: 'settings' as const, name: '보안 설정', icon: '🔒' },
    { id: 'sessions' as const, name: '활성 세션', icon: '📱' },
    { id: 'history' as const, name: '로그인 기록', icon: '📋' },
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

      {/* 알림 메시지 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md p-4">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* 보안 설정 탭 */}
      {activeTab === 'settings' && securitySettings && (
        <div className="space-y-6">
          {/* 2단계 인증 */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                2단계 인증 (2FA)
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>계정의 보안을 강화하기 위해 2단계 인증을 설정하세요.</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-3 ${securitySettings.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      2단계 인증 {securitySettings.twoFactorEnabled ? '활성화됨' : '비활성화됨'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSettingsUpdate({ twoFactorEnabled: !securitySettings.twoFactorEnabled })}
                    disabled={saving}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                      securitySettings.twoFactorEnabled 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
                  >
                    {securitySettings.twoFactorEnabled ? '비활성화' : '활성화'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 로그인 알림 */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                로그인 알림
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>새로운 로그인이 감지될 때 이메일 알림을 받으세요.</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={securitySettings.loginAlerts}
                    onChange={(e) => handleSettingsUpdate({ loginAlerts: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                    로그인 알림 활성화
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 세션 타임아웃 */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                세션 타임아웃
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>비활성 상태에서 자동으로 로그아웃될 시간을 설정하세요.</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center space-x-3">
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSettingsUpdate({ sessionTimeout: parseInt(e.target.value) })}
                    className="block rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    <option value={30}>30분</option>
                    <option value={60}>1시간</option>
                    <option value={120}>2시간</option>
                    <option value={240}>4시간</option>
                    <option value={480}>8시간</option>
                    <option value={720}>12시간</option>
                    <option value={1440}>24시간</option>
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400">후 자동 로그아웃</span>
                </div>
              </div>
            </div>
          </div>

          {/* IP 화이트리스트 */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                허용된 IP 주소
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>특정 IP 주소에서만 로그인을 허용합니다. 비어있으면 모든 IP가 허용됩니다.</p>
              </div>
              <div className="mt-5">
                <IPWhitelistForm 
                  allowedIps={securitySettings.allowedIps}
                  onUpdate={(ips) => handleSettingsUpdate({ allowedIps: ips })}
                />
              </div>
            </div>
          </div>

          {/* 비밀번호 변경 */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                비밀번호 변경
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>계정의 비밀번호를 변경하세요.</p>
              </div>
              <div className="mt-5">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  비밀번호 변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 활성 세션 탭 */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                활성 세션
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                현재 로그인된 모든 기기와 세션을 관리하세요
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleLogoutAllSessions}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                모든 다른 세션 로그아웃
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {sessions.map((session) => (
                <li key={session.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          session.isCurrentSession 
                            ? 'bg-green-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          <span className="text-white text-sm">
                            {session.userAgent.includes('Mobile') ? '📱' : '💻'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.isCurrentSession ? '현재 세션' : '다른 기기'}
                          {session.isCurrentSession && (
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              현재
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {session.ipAddress} • {getLocationFromIP(session.ipAddress)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {session.userAgent}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          생성: {formatDate(session.createdAt)} • 마지막 활동: {formatDate(session.lastActivity)}
                        </div>
                      </div>
                    </div>
                    {!session.isCurrentSession && (
                      <div>
                        <button
                          onClick={() => handleLogoutSession(session.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 로그인 기록 탭 */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              로그인 기록
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              최근 로그인 시도 기록을 확인하세요
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {loginHistory.map((history) => (
                <li key={history.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          history.status === 'SUCCESS'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}>
                          <span className="text-white text-sm">
                            {history.status === 'SUCCESS' ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {history.status === 'SUCCESS' ? '로그인 성공' : '로그인 실패'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {history.ipAddress} • {getLocationFromIP(history.ipAddress)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {history.userAgent}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(history.timestamp)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                비밀번호 변경
              </h3>
              <PasswordChangeForm 
                onClose={() => setShowPasswordModal(false)}
                onSuccess={() => {
                  setShowPasswordModal(false);
                  setSuccess('비밀번호가 성공적으로 변경되었습니다.');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// IP 화이트리스트 폼 컴포넌트
interface IPWhitelistFormProps {
  allowedIps: string[];
  onUpdate: (ips: string[]) => void;
}

function IPWhitelistForm({ allowedIps, onUpdate }: IPWhitelistFormProps) {
  const [newIp, setNewIp] = useState('');
  const [ips, setIps] = useState(allowedIps);

  const handleAddIp = () => {
    if (newIp && !ips.includes(newIp)) {
      const updatedIps = [...ips, newIp];
      setIps(updatedIps);
      onUpdate(updatedIps);
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    const updatedIps = ips.filter(i => i !== ip);
    setIps(updatedIps);
    onUpdate(updatedIps);
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newIp}
          onChange={(e) => setNewIp(e.target.value)}
          placeholder="IP 주소 입력 (예: 192.168.1.1)"
          className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
        <button
          onClick={handleAddIp}
          className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          추가
        </button>
      </div>
      {ips.length > 0 && (
        <div className="space-y-2">
          {ips.map((ip, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2">
              <span className="text-sm text-gray-900 dark:text-white">{ip}</span>
              <button
                onClick={() => handleRemoveIp(ip)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 비밀번호 변경 폼 컴포넌트
interface PasswordChangeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function PasswordChangeForm({ onClose, onSuccess }: PasswordChangeFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('비밀번호는 최소 8자리 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${config.apiBaseUrl}/api/v1/auth/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      onSuccess();
    } catch (err) {
      console.error('Failed to change password:', err);
      setError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          현재 비밀번호 *
        </label>
        <input
          type="password"
          required
          value={formData.currentPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          새 비밀번호 *
        </label>
        <input
          type="password"
          required
          value={formData.newPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          새 비밀번호 확인 *
        </label>
        <input
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
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
          {loading ? '변경 중...' : '변경'}
        </button>
      </div>
    </form>
  );
}
