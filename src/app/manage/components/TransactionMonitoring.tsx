'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/environment';

interface Transaction {
  id: string;
  orderId: string;
  userId: number;
  username: string;
  botName?: string;
  exchange: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  total: number;
  fee: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  strategy?: string;
  timestamp: string;
  notes?: string;
}

interface TransactionSummary {
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  successRate: number;
  recentTransactions: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
  exchangeBreakdown: Record<string, { count: number; volume: number }>;
}

interface SuspiciousActivity {
  id: string;
  type: 'HIGH_FREQUENCY' | 'LARGE_VOLUME' | 'UNUSUAL_PATTERN' | 'CONSECUTIVE_FAILURES';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  userId: number;
  username: string;
  description: string;
  timestamp: string;
  details?: Record<string, any>;
}

export default function TransactionMonitoring() {
  const [activeTab, setActiveTab] = useState<'list' | 'analytics' | 'suspicious'>('list');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // 필터링 상태
  const [filters, setFilters] = useState({
    exchange: '',
    status: '',
    type: '',
    dateRange: '7d'
  });

  useEffect(() => {
    fetchTransactionData();
    fetchSummaryData();
    fetchSuspiciousActivities();
  }, [filters]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // 모의 데이터 생성
      const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
        id: `tx_${i + 1}`,
        orderId: `ord_${Math.random().toString(36).substr(2, 9)}`,
        userId: Math.floor(Math.random() * 100) + 1,
        username: `user${Math.floor(Math.random() * 100) + 1}`,
        botName: Math.random() > 0.3 ? `Bot_${Math.floor(Math.random() * 5) + 1}` : undefined,
        exchange: ['Binance', 'Upbit', 'Bithumb'][Math.floor(Math.random() * 3)],
        symbol: ['BTC/KRW', 'ETH/KRW', 'ADA/KRW', 'DOT/KRW'][Math.floor(Math.random() * 4)],
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        amount: Math.floor(Math.random() * 10) + 0.1,
        price: Math.floor(Math.random() * 100000000) + 1000000,
        total: 0, // 계산될 예정
        fee: Math.floor(Math.random() * 10000) + 1000,
        status: ['COMPLETED', 'PENDING', 'FAILED', 'CANCELLED'][Math.floor(Math.random() * 4)] as any,
        strategy: Math.random() > 0.5 ? ['RSI', 'MACD', 'Bollinger', 'Grid'][Math.floor(Math.random() * 4)] : undefined,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: Math.random() > 0.7 ? 'Auto executed by trading bot' : undefined
      }));

      // total 계산
      mockTransactions.forEach(tx => {
        tx.total = tx.amount * tx.price;
      });

      setTransactions(mockTransactions);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('거래 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaryData = async () => {
    try {
      // 모의 요약 데이터
      const mockSummary: TransactionSummary = {
        totalTransactions: 1247,
        totalVolume: 48572391,
        totalFees: 125438,
        successRate: 94.2,
        recentTransactions: {
          last24h: 23,
          last7d: 156,
          last30d: 623
        },
        exchangeBreakdown: {
          'Binance': { count: 523, volume: 20450000 },
          'Upbit': { count: 412, volume: 15230000 },
          'Bithumb': { count: 312, volume: 12892391 }
        }
      };
      setSummary(mockSummary);
    } catch (err) {
      console.error('Failed to fetch summary data:', err);
    }
  };

  const fetchSuspiciousActivities = async () => {
    try {
      // 모의 의심스러운 활동 데이터
      const mockActivities: SuspiciousActivity[] = [
        {
          id: 'sus_1',
          type: 'HIGH_FREQUENCY',
          severity: 'HIGH',
          userId: 42,
          username: 'user42',
          description: '5분 동안 87건의 거래 실행 (임계값: 50건)',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: {
            transactionCount: 87,
            timeWindow: '5분',
            threshold: 50
          }
        },
        {
          id: 'sus_2',
          type: 'LARGE_VOLUME',
          severity: 'MEDIUM',
          userId: 15,
          username: 'user15',
          description: '단일 거래에서 15억원 거래량 (임계값: 10억원)',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          details: {
            transactionVolume: 1500000000,
            threshold: 1000000000
          }
        }
      ];
      setSuspiciousActivities(mockActivities);
    } catch (err) {
      console.error('Failed to fetch suspicious activities:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'BUY' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleInvestigateActivity = (activityId: string) => {
    console.log('Investigating activity:', activityId);
    // 실제로는 상세 조사 페이지로 이동하거나 모달을 열 것
  };

  const handleDismissActivity = (activityId: string) => {
    setSuspiciousActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  // 필터링된 거래 내역
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.exchange && transaction.exchange !== filters.exchange) return false;
    if (filters.status && transaction.status !== filters.status) return false;
    if (filters.type && transaction.type !== filters.type) return false;
    
    if (filters.dateRange) {
      const daysAgo = parseInt(filters.dateRange.replace('d', ''));
      const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      if (new Date(transaction.timestamp) < cutoffDate) return false;
    }
    
    return true;
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
          거래 모니터링
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          실시간 거래 내역 및 의심스러운 활동 모니터링
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 탭 내비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'list'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            거래 내역 ({filteredTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            분석
          </button>
          <button
            onClick={() => setActiveTab('suspicious')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'suspicious'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            의심 활동 ({suspiciousActivities.length})
          </button>
        </nav>
      </div>

      {/* 거래 내역 탭 */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* 필터링 옵션 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  거래소
                </label>
                <select
                  value={filters.exchange}
                  onChange={(e) => setFilters(prev => ({ ...prev, exchange: e.target.value }))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">전체</option>
                  <option value="Binance">Binance</option>
                  <option value="Upbit">Upbit</option>
                  <option value="Bithumb">Bithumb</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  상태
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">전체</option>
                  <option value="COMPLETED">완료</option>
                  <option value="PENDING">대기</option>
                  <option value="FAILED">실패</option>
                  <option value="CANCELLED">취소</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  거래 유형
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">전체</option>
                  <option value="BUY">매수</option>
                  <option value="SELL">매도</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  기간
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="1d">최근 1일</option>
                  <option value="7d">최근 7일</option>
                  <option value="30d">최근 30일</option>
                  <option value="">전체</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchTransactionData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                새로고침
              </button>
            </div>
          </div>

          {/* 거래 내역 테이블 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      사용자/봇
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      거래소/심볼
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      수량/가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      총액/수수료
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      시간
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.username}</div>
                        {transaction.botName && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.botName}</div>
                        )}
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {transaction.strategy && `${transaction.strategy} 전략`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.symbol}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'BUY' ? '매수' : '매도'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-gray-900 dark:text-white">{transaction.amount.toLocaleString()}</div>
                        <div className="text-gray-500 dark:text-gray-400">@ {formatCurrency(transaction.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.total)}</div>
                        <div className="text-gray-500 dark:text-gray-400">수수료: {formatCurrency(transaction.fee)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'COMPLETED' ? '완료' : 
                           transaction.status === 'PENDING' ? '대기' : 
                           transaction.status === 'FAILED' ? '실패' : '취소'}
                        </span>
                        {transaction.notes && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{transaction.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="상세 정보"
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">💳</div>
              <p className="text-gray-500 dark:text-gray-400">선택한 조건에 맞는 거래 내역이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 분석 탭 */}
      {activeTab === 'analytics' && summary && (
        <div className="space-y-6">
          {/* 거래 요약 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white">💱</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 거래 수</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{summary.totalTransactions.toLocaleString()}</dd>
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
                      <span className="text-white">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 거래량</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(summary.totalVolume)}</dd>
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
                      <span className="text-white">💸</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 수수료</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(summary.totalFees)}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">성공률</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{summary.successRate.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 기간별 거래 현황 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">기간별 거래 현황</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.recentTransactions.last24h.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">최근 24시간</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.recentTransactions.last7d.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">최근 7일</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.recentTransactions.last30d.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">최근 30일</div>
              </div>
            </div>
          </div>

          {/* 거래소별 현황 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">거래소별 현황</h3>
            <div className="space-y-4">
              {Object.entries(summary.exchangeBreakdown).map(([exchange, data]) => {
                const percentage = (data.count / summary.totalTransactions) * 100;
                return (
                  <div key={exchange}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{exchange}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {data.count.toLocaleString()}건 ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(data.volume)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 의심 활동 탭 */}
      {activeTab === 'suspicious' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">의심스러운 활동</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {suspiciousActivities.length}건의 활동이 감지됨
            </div>
          </div>

          {suspiciousActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">✅</div>
              <p className="text-gray-500 dark:text-gray-400">현재 의심스러운 활동이 감지되지 않았습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suspiciousActivities.map((activity) => (
                <div key={activity.id} className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(activity.severity)} mr-3`}>
                          {activity.severity === 'HIGH' ? '높음' : activity.severity === 'MEDIUM' ? '보통' : '낮음'}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.type === 'HIGH_FREQUENCY' ? '고빈도 거래' :
                           activity.type === 'LARGE_VOLUME' ? '대량 거래' :
                           activity.type === 'UNUSUAL_PATTERN' ? '비정상 패턴' : '연속 실패'}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                        <span>사용자: {activity.username} (ID: {activity.userId})</span>
                        <span>시간: {formatDate(activity.timestamp)}</span>
                      </div>
                      {activity.details && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>상세 정보:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {Object.entries(activity.details).map(([key, value]) => (
                                <li key={key}>{key}: {String(value)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleInvestigateActivity(activity.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        조사하기
                      </button>
                      <button
                        onClick={() => handleDismissActivity(activity.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
                      >
                        무시하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 모니터링 설정 */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">모니터링 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">고빈도 거래 감지</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  단시간 내 과도한 거래 빈도를 감지합니다.
                </p>
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">임계값:</label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">거래/5분</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">대량 거래 감지</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  비정상적으로 큰 거래량을 감지합니다.
                </p>
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">임계값:</label>
                  <input
                    type="number"
                    defaultValue={1000000}
                    className="w-32 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">원</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">연속 실패 감지</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  연속된 거래 실패 시도를 감지합니다.
                </p>
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">임계값:</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">연속 실패</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">알림 설정</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  의심 활동 감지 시 알림을 받습니다.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">이메일 알림</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">실시간 알림</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => alert('설정이 저장되었습니다.')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                설정 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 거래 상세 모달 */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                거래 상세 정보 #{selectedTransaction.id}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">주문 ID:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTransaction.orderId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">사용자:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTransaction.username}</span>
                </div>
                {selectedTransaction.botName && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">봇:</span>
                    <span className="text-gray-900 dark:text-white">{selectedTransaction.botName}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">거래소:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTransaction.exchange}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">심볼:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTransaction.symbol}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">유형:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type === 'BUY' ? '매수' : '매도'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">수량:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">가격:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.price)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">총액:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.total)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">수수료:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.fee)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">상태:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status === 'COMPLETED' ? '완료' : 
                     selectedTransaction.status === 'PENDING' ? '대기' : 
                     selectedTransaction.status === 'FAILED' ? '실패' : '취소'}
                  </span>
                </div>
                {selectedTransaction.strategy && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">전략:</span>
                    <span className="text-gray-900 dark:text-white">{selectedTransaction.strategy}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-300">시간:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(selectedTransaction.timestamp)}</span>
                </div>
                {selectedTransaction.notes && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">메모:</span>
                    <span className="text-gray-900 dark:text-white">{selectedTransaction.notes}</span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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