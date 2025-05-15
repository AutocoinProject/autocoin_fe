"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { name: 'Settings', path: '/settings', icon: '/icons/settings.svg' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

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
            {navigationItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Image src={item.icon} alt={`${item.name} icon`} width={20} height={20} />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">User Name</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
