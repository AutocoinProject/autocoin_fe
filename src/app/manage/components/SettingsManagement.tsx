'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    emailVerificationRequired: boolean;
    maxUsersPerIP: number;
    sessionTimeout: number;
  };
  trading: {
    maxBotsPerUser: number;
    defaultTradingFee: number;
    maxDailyTransactions: number;
    allowedExchanges: string[];
    riskManagement: {
      maxLeverageAllowed: number;
      defaultStopLoss: number;
      dailyLossLimit: number;
    };
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChars: boolean;
    twoFactorAuthMandatory: boolean;
    ipWhitelistEnabled: boolean;
    maxLoginAttempts: number;
    accountLockoutDuration: number;
  };
  notifications: {
    emailNotificationsEnabled: boolean;
    smsNotificationsEnabled: boolean;
    alertThresholds: {
      highVolumeTransaction: number;
      suspiciousActivity: boolean;
      systemErrors: boolean;
    };
  };
  api: {
    rateLimitEnabled: boolean;
    defaultRateLimit: number;
    apiKeyExpiry: number;
    webhookRetryAttempts: number;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'WELCOME' | 'PASSWORD_RESET' | 'TRADE_ALERT' | 'SYSTEM_NOTIFICATION';
  isActive: boolean;
}

interface MaintenanceSchedule {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'SCHEDULED' | 'EMERGENCY' | 'UPDATE';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  affectedServices: string[];
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'trading' | 'security' | 'notifications' | 'maintenance'>('general');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchEmailTemplates();
    fetchMaintenanceSchedules();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // 모의 설정 데이터
      const mockSettings: SystemSettings = {
        general: {
          siteName: 'AutoCoin',
          siteDescription: '자동화된 암호화폐 거래 플랫폼',
          maintenanceMode: false,
          allowRegistration: true,
          emailVerificationRequired: true,
          maxUsersPerIP: 5,
          sessionTimeout: 1440
        },
        trading: {
          maxBotsPerUser: 10,
          defaultTradingFee: 0.1,
          maxDailyTransactions: 1000,
          allowedExchanges: ['BINANCE', 'UPBIT', 'BITHUMB'],
          riskManagement: {
            maxLeverageAllowed: 10,
            defaultStopLoss: 5,
            dailyLossLimit: 10
          }
        },
        security: {
          passwordMinLength: 8,
          passwordRequireSpecialChars: true,
          twoFactorAuthMandatory: false,
          ipWhitelistEnabled: false,
          maxLoginAttempts: 5,
          accountLockoutDuration: 30
        },
        notifications: {
          emailNotificationsEnabled: true,
          smsNotificationsEnabled: false,
          alertThresholds: {
            highVolumeTransaction: 1000000,
            suspiciousActivity: true,
            systemErrors: true
          }
        },
        api: {
          rateLimitEnabled: true,
          defaultRateLimit: 1000,
          apiKeyExpiry: 30,
          webhookRetryAttempts: 3
        }
      };

      setSettings(mockSettings);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setError('설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // 모의 이메일 템플릿 데이터
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: '회원가입 환영 메일',
          subject: 'AutoCoin에 오신 것을 환영합니다!',
          content: '안녕하세요 {{username}}님, AutoCoin에 가입해주셔서 감사합니다...',
          type: 'WELCOME',
          isActive: true
        },
        {
          id: '2',
          name: '비밀번호 재설정',
          subject: '비밀번호 재설정 요청',
          content: '비밀번호 재설정을 위해 다음 링크를 클릭하세요: {{reset_link}}',
          type: 'PASSWORD_RESET',
          isActive: true
        },
        {
          id: '3',
          name: '거래 알림',
          subject: '거래 체결 알림',
          content: '{{symbol}} {{type}} 주문이 체결되었습니다. 수량: {{amount}}',
          type: 'TRADE_ALERT',
          isActive: true
        }
      ];

      setEmailTemplates(mockTemplates);
    } catch (err) {
      console.error('Failed to fetch email templates:', err);
    }
  };

  const fetchMaintenanceSchedules = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // 모의 유지보수 일정 데이터
      const mockSchedules: MaintenanceSchedule[] = [
        {
          id: '1',
          title: '정기 시스템 점검',
          description: '서버 성능 최적화 및 보안 업데이트',
          startTime: '2024-01-20T02:00:00Z',
          endTime: '2024-01-20T06:00:00Z',
          type: 'SCHEDULED',
          status: 'PLANNED',
          affectedServices: ['Trading Engine', 'API Server']
        },
        {
          id: '2',
          title: '데이터베이스 업그레이드',
          description: '새로운 기능 지원을 위한 데이터베이스 스키마 업데이트',
          startTime: '2024-01-25T01:00:00Z',
          endTime: '2024-01-25T05:00:00Z',
          type: 'UPDATE',
          status: 'PLANNED',
          affectedServices: ['Database', 'User Service']
        }
      ];

      setMaintenanceSchedules(mockSchedules);
    } catch (err) {
      console.error('Failed to fetch maintenance schedules:', err);
    }
  };

  const handleSaveSettings = async (category: keyof SystemSettings, newSettings: any) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      
      if (settings) {
        const updatedSettings = {
          ...settings,
          [category]: { ...settings[category], ...newSettings }
        };
        setSettings(updatedSettings);
      }
      
      setSuccess('설정이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailTemplate = async (template: EmailTemplate) => {
    try {
      const token = localStorage.getItem('authToken');
      
      setEmailTemplates(prev => 
        prev.map(t => t.id === template.id ? template : t)
      );
      
      setSelectedTemplate(null);
      setSuccess('이메일 템플릿이 저장되었습니다.');
    } catch (err) {
      console.error('Failed to save email template:', err);
      alert('이메일 템플릿 저장에 실패했습니다.');
    }
  };

  const handleCreateMaintenanceSchedule = async (schedule: Omit<MaintenanceSchedule, 'id'>) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const newSchedule: MaintenanceSchedule = {
        ...schedule,
        id: Date.now().toString()
      };
      
      setMaintenanceSchedules(prev => [...prev, newSchedule]);
      setShowMaintenanceModal(false);
      setSuccess('유지보수 일정이 생성되었습니다.');
    } catch (err) {
      console.error('Failed to create maintenance schedule:', err);
      alert('유지보수 일정 생성에 실패했습니다.');
    }
  };

  const handleDeleteMaintenanceSchedule = async (scheduleId: string) => {
    if (!confirm('이 유지보수 일정을 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('authToken');
      
      setMaintenanceSchedules(prev => prev.filter(s => s.id !== scheduleId));
      setSuccess('유지보수 일정이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete maintenance schedule:', err);
      alert('유지보수 일정 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const tabs = [
    { id: 'general' as const, name: '일반 설정', icon: '⚙️' },
    { id: 'trading' as const, name: '거래 설정', icon: '💱' },
    { id: 'security' as const, name: '보안 설정', icon: '🔒' },
    { id: 'notifications' as const, name: '알림 설정', icon: '🔔' },
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

      {/* 일반 설정 탭 */}
      {activeTab === 'general' && settings && (
        <div className="space-y-6">
          <GeneralSettings 
            settings={settings.general}
            onSave={(newSettings) => handleSaveSettings('general', newSettings)}
            saving={saving}
          />
        </div>
      )}

      {/* 거래 설정 탭 */}
      {activeTab === 'trading' && settings && (
        <div className="space-y-6">
          <TradingSettings 
            settings={settings.trading}
            onSave={(newSettings) => handleSaveSettings('trading', newSettings)}
            saving={saving}
          />
        </div>
      )}

      {/* 보안 설정 탭 */}
      {activeTab === 'security' && settings && (
        <div className="space-y-6">
          <SecuritySettings 
            settings={settings.security}
            onSave={(newSettings) => handleSaveSettings('security', newSettings)}
            saving={saving}
          />
        </div>
      )}

      {/* 알림 설정 탭 */}
      {activeTab === 'notifications' && settings && (
        <div className="space-y-6">
          <NotificationSettings 
            settings={settings.notifications}
            onSave={(newSettings) => handleSaveSettings('notifications', newSettings)}
            saving={saving}
          />

          {/* 이메일 템플릿 관리 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">이메일 템플릿 관리</h3>
            <div className="space-y-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{template.subject}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        template.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {template.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                    >
                      편집
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 유지보수 탭 */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">유지보수 일정</h3>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              새 일정 추가
            </button>
          </div>

          <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {maintenanceSchedules.map((schedule) => (
                <li key={schedule.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{schedule.title}</h4>
                        <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                          {schedule.status === 'PLANNED' ? '예정' : 
                           schedule.status === 'IN_PROGRESS' ? '진행중' : 
                           schedule.status === 'COMPLETED' ? '완료' : '취소'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{schedule.description}</p>
                      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>시작: {formatDate(schedule.startTime)}</span>
                        <span className="mx-2">•</span>
                        <span>종료: {formatDate(schedule.endTime)}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">영향받는 서비스: </span>
                        {schedule.affectedServices.map((service, index) => (
                          <span key={service} className="text-xs text-gray-700 dark:text-gray-300">
                            {service}{index < schedule.affectedServices.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteMaintenanceSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 시스템 상태 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">시스템 상태</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">정상</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">전체 시스템</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">가동률 (30일)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">예정된 유지보수</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 템플릿 편집 모달 */}
      {selectedTemplate && (
        <EmailTemplateModal
          template={selectedTemplate}
          onSave={handleSaveEmailTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      {/* 유지보수 일정 생성 모달 */}
      {showMaintenanceModal && (
        <MaintenanceScheduleModal
          onCreate={handleCreateMaintenanceSchedule}
          onClose={() => setShowMaintenanceModal(false)}
        />
      )}
    </div>
  );
}

// 일반 설정 컴포넌트
interface GeneralSettingsProps {
  settings: SystemSettings['general'];
  onSave: (settings: Partial<SystemSettings['general']>) => void;
  saving: boolean;
}

function GeneralSettings({ settings, onSave, saving }: GeneralSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">일반 설정</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사이트 이름</label>
          <input
            type="text"
            value={formData.siteName}
            onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사이트 설명</label>
          <textarea
            value={formData.siteDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.maintenanceMode}
            onChange={(e) => setFormData(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">유지보수 모드</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.allowRegistration}
            onChange={(e) => setFormData(prev => ({ ...prev, allowRegistration: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">회원가입 허용</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.emailVerificationRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, emailVerificationRequired: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">이메일 인증 필수</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IP당 최대 사용자 수</label>
          <input
            type="number"
            min="1"
            value={formData.maxUsersPerIP}
            onChange={(e) => setFormData(prev => ({ ...prev, maxUsersPerIP: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">세션 타임아웃 (분)</label>
          <input
            type="number"
            min="1"
            value={formData.sessionTimeout}
            onChange={(e) => setFormData(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 거래 설정 컴포넌트
interface TradingSettingsProps {
  settings: SystemSettings['trading'];
  onSave: (settings: Partial<SystemSettings['trading']>) => void;
  saving: boolean;
}

function TradingSettings({ settings, onSave, saving }: TradingSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">거래 설정</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사용자당 최대 봇 수</label>
          <input
            type="number"
            min="1"
            value={formData.maxBotsPerUser}
            onChange={(e) => setFormData(prev => ({ ...prev, maxBotsPerUser: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">기본 거래 수수료 (%)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.defaultTradingFee}
            onChange={(e) => setFormData(prev => ({ ...prev, defaultTradingFee: parseFloat(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">일일 최대 거래 수</label>
          <input
            type="number"
            min="1"
            value={formData.maxDailyTransactions}
            onChange={(e) => setFormData(prev => ({ ...prev, maxDailyTransactions: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">허용된 거래소</label>
          <div className="space-y-2">
            {['BINANCE', 'UPBIT', 'BITHUMB'].map((exchange) => (
              <label key={exchange} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowedExchanges.includes(exchange)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        allowedExchanges: [...prev.allowedExchanges, exchange]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        allowedExchanges: prev.allowedExchanges.filter(ex => ex !== exchange)
                      }));
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900 dark:text-white">{exchange}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">리스크 관리</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">최대 허용 레버리지</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.riskManagement.maxLeverageAllowed}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  riskManagement: {
                    ...prev.riskManagement,
                    maxLeverageAllowed: parseInt(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">기본 손절 비율 (%)</label>
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={formData.riskManagement.defaultStopLoss}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  riskManagement: {
                    ...prev.riskManagement,
                    defaultStopLoss: parseFloat(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">일일 손실 한도 (%)</label>
              <input
                type="number"
                min="1"
                max="50"
                step="0.1"
                value={formData.riskManagement.dailyLossLimit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  riskManagement: {
                    ...prev.riskManagement,
                    dailyLossLimit: parseFloat(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 보안 설정 컴포넌트
interface SecuritySettingsProps {
  settings: SystemSettings['security'];
  onSave: (settings: Partial<SystemSettings['security']>) => void;
  saving: boolean;
}

function SecuritySettings({ settings, onSave, saving }: SecuritySettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">보안 설정</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호 최소 길이</label>
          <input
            type="number"
            min="6"
            max="32"
            value={formData.passwordMinLength}
            onChange={(e) => setFormData(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.passwordRequireSpecialChars}
            onChange={(e) => setFormData(prev => ({ ...prev, passwordRequireSpecialChars: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">특수문자 필수</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.twoFactorAuthMandatory}
            onChange={(e) => setFormData(prev => ({ ...prev, twoFactorAuthMandatory: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">2단계 인증 필수</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.ipWhitelistEnabled}
            onChange={(e) => setFormData(prev => ({ ...prev, ipWhitelistEnabled: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">IP 화이트리스트 활성화</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">최대 로그인 시도 횟수</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.maxLoginAttempts}
            onChange={(e) => setFormData(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">계정 잠금 시간 (분)</label>
          <input
            type="number"
            min="1"
            value={formData.accountLockoutDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, accountLockoutDuration: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 알림 설정 컴포넌트
interface NotificationSettingsProps {
  settings: SystemSettings['notifications'];
  onSave: (settings: Partial<SystemSettings['notifications']>) => void;
  saving: boolean;
}

function NotificationSettings({ settings, onSave, saving }: NotificationSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">알림 설정</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.emailNotificationsEnabled}
            onChange={(e) => setFormData(prev => ({ ...prev, emailNotificationsEnabled: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">이메일 알림 활성화</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.smsNotificationsEnabled}
            onChange={(e) => setFormData(prev => ({ ...prev, smsNotificationsEnabled: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-white">SMS 알림 활성화</label>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">알림 임계값</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">고액 거래 알림 기준 (원)</label>
              <input
                type="number"
                min="0"
                value={formData.alertThresholds.highVolumeTransaction}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    highVolumeTransaction: parseInt(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.alertThresholds.suspiciousActivity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    suspiciousActivity: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-white">의심 활동 알림</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.alertThresholds.systemErrors}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    systemErrors: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-white">시스템 오류 알림</label>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 이메일 템플릿 편집 모달
interface EmailTemplateModalProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onClose: () => void;
}

function EmailTemplateModal({ template, onSave, onClose }: EmailTemplateModalProps) {
  const [formData, setFormData] = useState(template);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            이메일 템플릿 편집 - {template.name}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">템플릿 이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                사용 가능한 변수: {{username}}, {{email}}, {{reset_link}}, {{symbol}}, {{amount}}, {{type}}
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-white">활성화</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 유지보수 일정 생성 모달
interface MaintenanceScheduleModalProps {
  onCreate: (schedule: Omit<MaintenanceSchedule, 'id'>) => void;
  onClose: () => void;
}

function MaintenanceScheduleModal({ onCreate, onClose }: MaintenanceScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'SCHEDULED' as MaintenanceSchedule['type'],
    status: 'PLANNED' as MaintenanceSchedule['status'],
    affectedServices: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const services = ['Trading Engine', 'API Server', 'Database', 'User Service', 'Notification Service'];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            유지보수 일정 생성
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">시작 시간</label>
              <input
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">종료 시간</label>
              <input
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">유형</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MaintenanceSchedule['type'] }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="SCHEDULED">정기 점검</option>
                <option value="EMERGENCY">긴급 점검</option>
                <option value="UPDATE">업데이트</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">영향받는 서비스</label>
              <div className="space-y-2">
                {services.map((service) => (
                  <label key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.affectedServices.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            affectedServices: [...prev.affectedServices, service]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            affectedServices: prev.affectedServices.filter(s => s !== service)
                          }));
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
