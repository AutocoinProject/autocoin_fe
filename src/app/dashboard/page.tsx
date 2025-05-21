'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CoinCard from './components/CoinCard';
import PortfolioCard from './components/PortfolioCard';
import CreditCard from './components/CreditCard';
import ChartCard from './components/ChartCard';
import LiveMarketTable from './components/LiveMarketTable';
import AuthDebug from '@/components/AuthDebug';

// 디버그 도구 로드
if (typeof window !== 'undefined') {
  import('@/lib/oauthDebug');
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '안녕하세요';
    if (hour < 18) return '안녕하세요';
    return '안녕하세요';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {user ? `${getGreeting()}, ${user.username}님!` : 'Dashboard'}
          </h1>
          {user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              오늘도 좋은 카지노 운영을 위해 노력하고 계시네요!
            </p>
          )}
        </div>
        {user?.provider === 'kakao' && (
          <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c7.8 0 11 3.2 11 7 0 4.8-4.2 8-11 8-.8 0-1.6 0-2.4-.2L5 21l2.4-3c-3-2-4.4-4.8-4.4-8 0-3.8 3.2-7 11-7z"/>
            </svg>
            <span>카카오로 로그인한 사용자</span>
          </div>
        )}
      </div>
      
      {/* First row - Coin cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CoinCard 
          name="Bitcoin" 
          symbol="BTC" 
          price={63452.18} 
          change={2.34} 
          icon="/icons/btc.svg"
        />
        <CoinCard 
          name="Ethereum" 
          symbol="ETH" 
          price={3284.75} 
          change={-1.52} 
          icon="/icons/eth.svg"
        />
        <CoinCard 
          name="Solana" 
          symbol="SOL" 
          price={146.82} 
          change={5.68} 
          icon="/icons/sol.svg"
        />
        <CoinCard 
          name="Cardano" 
          symbol="ADA" 
          price={0.548} 
          change={-0.72} 
          icon="/icons/ada.svg"
        />
      </div>
      
      {/* Second row - Portfolio and Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioCard 
            totalValue={15834.29} 
            change={3.7} 
            assets={[
              { name: 'Bitcoin', symbol: 'BTC', value: 8254.12, percentage: 52 },
              { name: 'Ethereum', symbol: 'ETH', value: 4972.36, percentage: 31 },
              { name: 'Solana', symbol: 'SOL', value: 1823.94, percentage: 12 },
              { name: 'Others', value: 783.87, percentage: 5 }
            ]} 
          />
        </div>
        <div>
          <CreditCard 
            number="**** **** **** 4589"
            name="John Doe"
            expiry="12/27"
          />
        </div>
      </div>
      
      {/* Third row - Chart and Market */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard />
        </div>
        <div>
          <LiveMarketTable />
        </div>
      </div>
      
      {/* 디버깅 컴포넌트 */}
      <AuthDebug />
    </div>
  );
}
