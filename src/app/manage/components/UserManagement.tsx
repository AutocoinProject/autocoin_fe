'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'ROLE_USER' | 'ROLE_ADMIN';
  provider: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  profileImage?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  adminUsers: number;
  verifiedUsers: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // 모의 데이터 생성
      const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i < 5 ? 'ADMIN' : 'USER',
        provider: Math.random() > 0.7 ? 'google' : 'local',
        isActive: Math.random() > 0.1,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLoginAt: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        isEmailVerified: Math.random() > 0.15,
        profileImage: Math.random() > 0.7 ? `/api/placeholder/40/40` : undefined
      }));

      setUsers(mockUsers);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // 모의 통계 데이터
      const mockStats: UserStats = {
        totalUsers: 1247,
        activeUsers: 1156,
        newUsersThisWeek: 23,
        adminUsers: 5,
        verifiedUsers: 1089
      };
      setStats(mockStats);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const handleUserAction = async (userId: number, action: 'activate' | 'deactivate' | 'promote' | 'demote' | 'delete') => {
    try {
      const token = localStorage.getItem('authToken');
      
      switch (action) {
        case 'activate':
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, isActive: action === 'activate' } : user
          ));
          break;
        case 'promote':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, role: 'ADMIN' } : user
          ));
          break;
        case 'demote':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, role: 'USER' } : user
          ));
          break;
        case 'delete':
          if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
          }
          break;
      }
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      alert(`사용자 ${action} 작업에 실패했습니다.`);
    }
  };

  const handleSendEmail = (userId: number) => {
    console.log('Sending email to user:', userId);
    alert('이메일 발송 기능은 구현 예정입니다.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' || role === 'ROLE_ADMIN'
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getProviderIcon = (provider: string | null) => {
    switch (provider) {
      case 'google':
        return '🌐';
      case 'kakao':
        return '💬';
      case 'naver':
        return '🔵';
      default:
        return '📧';
    }
  };

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive) ||
                         (filterStatus === 'verified' && user.isEmailVerified) ||
                         (filterStatus === 'unverified' && !user.isEmailVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
          사용자 관리
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          전체 사용자 계정을 관리하고 권한을 설정합니다
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 사용자 통계 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center text-white">👥</div>
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
                  <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center text-white">✅</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">활성 사용자</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.activeUsers.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center text-white">🆕</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">이번 주 신규</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.newUsersThisWeek.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-red-500 rounded-md flex items-center justify-center text-white">👑</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">관리자</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.adminUsers.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center text-white">✉️</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">이메일 인증</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.verifiedUsers.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 및 필터링 */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              검색
            </label>
            <input
              type="text"
              placeholder="사용자명 또는 이메일"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              권한
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">전체</option>
              <option value="USER">일반 사용자</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              상태
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="verified">이메일 인증됨</option>
              <option value="unverified">이메일 미인증</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchUsers}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>

      {/* 사용자 테이블 */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            사용자 목록 ({filteredUsers.length}명)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  권한/상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  인증 방식
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  마지막 로그인
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.profileImage ? (
                          <img className="h-10 w-10 rounded-full" src={user.profileImage} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        {!user.isEmailVerified && (
                          <div className="text-xs text-red-500 dark:text-red-400">이메일 미인증</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                        {user.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getProviderIcon(user.provider)}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {user.provider || 'local'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '로그인 기록 없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="상세 정보"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleSendEmail(user.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="이메일 보내기"
                      >
                        ✉️
                      </button>
                      {user.isActive ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'deactivate')}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="비활성화"
                        >
                          🚫
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="활성화"
                        >
                          ✅
                        </button>
                      )}
                      {user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'promote')}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="관리자로 승격"
                        >
                          👑
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'demote')}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="관리자에서 강등"
                        >
                          👤
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <p className="text-gray-500 dark:text-gray-400">조건에 맞는 사용자가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 사용자 상세 모달 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                사용자 상세 정보
              </h3>
              <div className="space-y-3 text-sm">
                <div className="text-center mb-6">
                  {selectedUser.profileImage ? (
                    <img className="h-20 w-20 rounded-full mx-auto" src={selectedUser.profileImage} alt="" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h4 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedUser.username}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">ID:</span>
                  <span className="text-gray-900 dark:text-white">{selectedUser.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">이메일:</span>
                  <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">권한:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role === 'ADMIN' || selectedUser.role === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">상태:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.isActive)}`}>
                    {selectedUser.isActive ? '활성' : '비활성'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">인증 방식:</span>
                  <span className="text-gray-900 dark:text-white">
                    {getProviderIcon(selectedUser.provider)} {selectedUser.provider || 'local'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">이메일 인증:</span>
                  <span className={selectedUser.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {selectedUser.isEmailVerified ? '✅ 인증됨' : '❌ 미인증'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">가입일:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">마지막 수정:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(selectedUser.updatedAt)}</span>
                </div>
                {selectedUser.lastLoginAt && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">마지막 로그인:</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(selectedUser.lastLoginAt)}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    handleSendEmail(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  이메일 보내기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}