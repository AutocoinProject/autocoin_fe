"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '/icons/dashboard.svg' },
  { name: 'Chart', path: '/chart', icon: '/icons/chart.svg' },
  
  // Bot Pages
  { name: 'BinanceBot', path: '/bots/binance', icon: '/icons/bot.svg' },
  { name: 'UpbitBot', path: '/bots/upbit', icon: '/icons/bot.svg' },
  { name: 'BithumbBot', path: '/bots/bithumb', icon: '/icons/bot.svg' },
  
  // Backtest Page
  { name: 'Backtest', path: '/backtest', icon: '/icons/backtest.svg' },
  
  // Board Page
  { name: 'Board', path: '/board', icon: '/icons/news.svg' },

  { name: 'Transactions', path: '/transactions', icon: '/icons/transaction.svg' },
  { name: 'Wallet', path: '/wallet', icon: '/icons/wallet.svg' },
  { name: 'News', path: '/news', icon: '/icons/news.svg' },
  { name: 'Mailbox', path: '/mailbox', icon: '/icons/mail.svg' },
  { name: 'Manage', path: '/manage', icon: '/icons/manage.svg', adminOnly: true },
  { name: 'Profile', path: '/profile', icon: '/icons/settings.svg' },
  { name: 'Settings', path: '/settings', icon: '/icons/settings.svg' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center">
              <Image src="/logo.svg" alt="AutoCoin Logo" width={32} height={32} />
              <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">AutoCoin</span>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center w-full">
              <Image src="/logo.svg" alt="AutoCoin Logo" width={32} height={32} />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems
              .filter(item => {
                // 관리자 전용 메뉴는 관리자가 아니면 숨김
                if (item.adminOnly) {
                  // 임시로 모든 사용자에게 manage 페이지 접근 허용 (테스트용)
                  return true;
                  // return user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');
                }
                return true;
              })
              .map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300'
                      }${
                        item.adminOnly ? ' border-l-4 border-red-500' : ''
                      }`}
                    >
                      <Image src={item.icon} alt={`${item.name} icon`} width={20} height={20} />
                      {!collapsed && (
                        <span className="ml-3">
                          {item.name}
                          {item.adminOnly && (
                            <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded">
                              Manage
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link href="/profile" className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.username || '사용자'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
