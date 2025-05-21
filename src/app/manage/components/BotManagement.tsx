'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface Bot {
  id: number;
  name: string;
  userId: number;
  username: string;
  exchange: 'BINANCE' | 'UPBIT' | 'BITHUMB';
  status: 'RUNNING' | 'STOPPED' | 'ERROR' | 'PAUSED';
  strategy: string;
  balance: number;
  profit: number;
  profitPercentage: number;
  totalTrades: number;
  successRate: number;
  maxDrawdown: number;
  createdAt: string;
  lastActivityAt: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
}

interface BotPerformance {
  totalBots: number;
  activeBots: number;
  totalProfit: number;
  avgSuccessRate: number;
  topPerformers: Bot[];
  worstPerformers: Bot[];
}

export default function BotManagement() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [performance, setPerformance] = useState<BotPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterExchange, setFilterExchange] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchBots();
    fetchPerformance();
  }, []);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // 모의 데이터 - 실제 환경에서는 실제 API 호출
      const mockBots: Bot[] = [
        {
          id: 1,
          name: 'Bitcoin Scalper',
          userId: 100,
          username: 'trader_john',
          exchange: 'BINANCE',
          status: 'RUNNING',
          strategy: 'SCALPING',
          balance: 5000000,
          profit: 250000,
          profitPercentage: 5.2,
          totalTrades: 1523,
          successRate: 68.5,
          maxDrawdown: -12.3,
          createdAt: '2024-01-10T10:00:00Z',
          lastActivityAt: new Date().toISOString(),
          riskLevel: 'HIGH',
          isActive: true
        },
        {
          id: 2,
          name: 'Ethereum DCA',
          userId: 101,
          username: 'crypto_alice',
          exchange: 'UPBIT',
          status: 'RUNNING',
          strategy: 'DCA',
          balance: 10000000,
          profit: 850000,
          profitPercentage: 9.3,
          totalTrades: 89,
          successRate: 85.2,
          maxDrawdown: -5.1,
          createdAt: '2024-01-05T14:30:00Z',
          lastActivityAt: new Date(Date.now() - 300000).toISOString(),
          riskLevel: 'LOW',
          isActive: true
        },
        {
          id: 3,
          name: 'Altcoin Grid',
          userId: 102,
          username: 'grid_master',
          exchange: 'BITHUMB',
          status: 'ERROR',
          strategy: 'GRID',
          balance: 3000000,
          profit: -50000,
          profitPercentage: -1.6,
          totalTrades: 245,
          successRate: 45.2,
          maxDrawdown: -25.8,
          createdAt: '2024-01-12T08:15:00Z',
          lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
          riskLevel: 'MEDIUM',
          isActive: false
        },
        {
          id: 4,
          name: 'Momentum Trader',
          userId: 103,
          username: 'momentum_pro',
          exchange: 'BINANCE',
          status: 'PAUSED',
          strategy: 'MOMENTUM',
          balance: 7500000,
          profit: 450000,
          profitPercentage: 6.4,
          totalTrades: 356,
          successRate: 72.8,
          maxDrawdown: -8.9,
          createdAt: '2024-01-08T16:45:00Z',
          lastActivityAt: new Date(Date.now() - 1800000).toISOString(),
          riskLevel: 'MEDIUM',
          isActive: true
        },
        {
          id: 5,
          name: 'Safe Haven',
          userId: 104,
          username: 'conservative_trader',
          exchange: 'UPBIT',
          status: 'STOPPED',
          strategy: 'MEAN_REVERSION',
          balance: 2000000,
          profit: 120000,
          profitPercentage: 6.2,
          totalTrades: 78,
          successRate: 89.7,
          maxDrawdown: -3.2,
          createdAt: '2024-01-15T09:20:00Z',
          lastActivityAt: new Date(Date.now() - 7200000).toISOString(),
          riskLevel: 'LOW',
          isActive: true
        }
      ];

      setBots(mockBots);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bots:', err);
      setError('봇 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // 모의 성과 데이터
      const mockPerformance: BotPerformance = {
        totalBots: 89,
        activeBots: 67,
        totalProfit: 12500000,
        avgSuccessRate: 72.3,
        topPerformers: [],
        worstPerformers: []
      };

      setPerformance(mockPerformance);
    } catch (err) {
      console.error('Failed to fetch performance:', err);
    }
  };

  const handleBotAction = async (botId: number, action: 'start' | 'stop' | 'pause' | 'reset') => {
    if (action === 'reset' && !confirm('봇을 리셋하시겠습니까? 모든 설정이 초기화됩니다.')) return;
    if (action === 'stop' && !confirm('봇을 정지하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('authToken');
      
      // 모의 액션 처리
      setBots(prev => prev.map(bot => 
        bot.id === botId 
          ? { 
              ...bot, 
              status: action === 'start' ? 'RUNNING' : action === 'stop' ? 'STOPPED' : action === 'pause' ? 'PAUSED' : bot.status,
              lastActivityAt: new Date().toISOString()
            }
          : bot
      ));
      
      alert(`봇 ${action} 작업이 완료되었습니다.`);
    } catch (err) {
      console.error(`Failed to ${action} bot:`, err);
      alert(`봇 ${action} 작업에 실패했습니다.`);
    }
  };

  const handleToggleBotActive = async (botId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      
      setBots(prev => prev.map(bot => 
        bot.id === botId ? { ...bot, isActive: !isActive } : bot
      ));
      
      alert(`봇이 ${!isActive ? '활성화' : '비활성화'}되었습니다.`);
    } catch (err) {
      console.error('Failed to toggle bot status:', err);
      alert('봇 상태 변경에 실패했습니다.');
    }
  };

  const handleSendNotification = async (botId: number) => {
    const message = prompt('사용자에게 전송할 알림 메시지를 입력하세요:');
    if (!message) return;

    try {
      const token = localStorage.getItem('authToken');
      
      // 모의 알림 전송
      alert('알림이 사용자에게 전송되었습니다.');
    } catch (err) {
      console.error('Failed to send notification:', err);
      alert('알림 전송에 실패했습니다.');
    }
  };

  const filteredAndSortedBots = bots
    .filter(bot => {
      const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bot.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || bot.status === filterStatus;
      const matchesExchange = filterExchange === 'ALL' || bot.exchange === filterExchange;
      return matchesSearch && matchesStatus && matchesExchange;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Bot];
      let bValue = b[sortBy as keyof Bot];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'STOPPED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ERROR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 성과 통계 */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white">🤖</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 봇 수</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{performance.totalBots.toLocaleString()}</dd>
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
                    <span className="text-white">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">활성 봇</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{performance.activeBots.toLocaleString()}</dd>
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
                    <span className="text-white">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 수익</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(performance.totalProfit)}</dd>
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
                    <span className="text-white">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">평균 성공률</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{performance.avgSuccessRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">검색</label>
            <input
              type="text"
              placeholder="봇 이름 또는 사용자명..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상태</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="ALL">모든 상태</option>
              <option value="RUNNING">실행 중</option>
              <option value="STOPPED">정지</option>
              <option value="PAUSED">일시정지</option>
              <option value="ERROR">오류</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">거래소</label>
            <select
              value={filterExchange}
              onChange={(e) => setFilterExchange(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="ALL">모든 거래소</option>
              <option value="BINANCE">바이낸스</option>
              <option value="UPBIT">업비트</option>
              <option value="BITHUMB">빗썸</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">정렬 기준</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="createdAt">생성일</option>
              <option value="profit">수익</option>
              <option value="profitPercentage">수익률</option>
              <option value="successRate">성공률</option>
              <option value="totalTrades">총 거래수</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">정렬 순서</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 봇 목록 */}
      <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">봇 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">소유자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">거래소/전략</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">성과</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">위험도</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">마지막 활동</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAndSortedBots.map((bot) => (
                <tr key={bot.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">🤖</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{bot.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {bot.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{bot.username}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">UID: {bot.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExchangeColor(bot.exchange)} mr-2`}>
                      {bot.exchange}
                    </span>
                    <div className="text-sm text-gray-900 dark:text-white">{bot.strategy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bot.status)}`}>
                        {bot.status === 'RUNNING' ? '실행중' : bot.status === 'STOPPED' ? '정지' : bot.status === 'PAUSED' ? '일시정지' : '오류'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bot.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {bot.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div className={`font-medium ${bot.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(bot.profit)} ({bot.profitPercentage >= 0 ? '+' : ''}{bot.profitPercentage.toFixed(1)}%)
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        거래: {bot.totalTrades.toLocaleString()} | 성공률: {bot.successRate.toFixed(1)}%
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        최대손실: {bot.maxDrawdown.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(bot.riskLevel)}`}>
                      {bot.riskLevel === 'LOW' ? '낮음' : bot.riskLevel === 'MEDIUM' ? '보통' : '높음'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(bot.lastActivityAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedBot(bot)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="상세 정보"
                      >
                        👁️
                      </button>
                      {bot.status === 'STOPPED' || bot.status === 'ERROR' ? (
                        <button
                          onClick={() => handleBotAction(bot.id, 'start')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="시작"
                        >
                          ▶️
                        </button>
                      ) : bot.status === 'RUNNING' ? (
                        <>
                          <button
                            onClick={() => handleBotAction(bot.id, 'pause')}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="일시정지"
                          >
                            ⏸️
                          </button>
                          <button
                            onClick={() => handleBotAction(bot.id, 'stop')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="정지"
                          >
                            ⏹️
                          </button>
                        </>
                      ) : bot.status === 'PAUSED' ? (
                        <button
                          onClick={() => handleBotAction(bot.id, 'start')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="재시작"
                        >
                          ▶️
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleToggleBotActive(bot.id, bot.isActive)}
                        className={`${bot.isActive ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}`}
                        title={bot.isActive ? '비활성화' : '활성화'}
                      >
                        {bot.isActive ? '🚫' : '✅'}
                      </button>
                      <button
                        onClick={() => handleSendNotification(bot.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="알림 전송"
                      >
                        📧
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 봇 상세 모달 */}
      {selectedBot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                봇 상세 정보 - {selectedBot.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">ID:</span>
                  <span className="text-gray-900 dark:text-white">{selectedBot.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">소유자:</span>
                  <span className="text-gray-900 dark:text-white">{selectedBot.username}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">거래소:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExchangeColor(selectedBot.exchange)}`}>
                    {selectedBot.exchange}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">전략:</span>
                  <span className="text-gray-900 dark:text-white">{selectedBot.strategy}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">상태:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBot.status)}`}>
                    {selectedBot.status === 'RUNNING' ? '실행중' : selectedBot.status === 'STOPPED' ? '정지' : selectedBot.status === 'PAUSED' ? '일시정지' : '오류'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">위험도:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(selectedBot.riskLevel)}`}>
                    {selectedBot.riskLevel === 'LOW' ? '낮음' : selectedBot.riskLevel === 'MEDIUM' ? '보통' : '높음'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">잔고:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(selectedBot.balance)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">수익:</span>
                  <span className={`font-medium ${selectedBot.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedBot.profit)} ({selectedBot.profitPercentage >= 0 ? '+' : ''}{selectedBot.profitPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">총 거래:</span>
                  <span className="text-gray-900 dark:text-white">{selectedBot.totalTrades.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">성공률:</span>
                  <span className="text-gray-900 dark:text-white">{selectedBot.successRate.toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">최대손실:</span>
                  <span className="text-red-600">{selectedBot.maxDrawdown.toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">생성일:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(selectedBot.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">마지막 활동:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(selectedBot.lastActivityAt)}</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleSendNotification(selectedBot.id)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  알림 전송
                </button>
                <button
                  onClick={() => handleBotAction(selectedBot.id, 'reset')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  리셋
                </button>
                <button
                  onClick={() => setSelectedBot(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
