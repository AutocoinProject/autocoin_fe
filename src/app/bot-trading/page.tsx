'use client';

import React, { useState } from 'react';

// Example bot data structure
interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'inactive' | 'error';
  profitPercent: number;
  createdAt: string;
}

// Mock data for demonstration
const initialBots: TradingBot[] = [
  {
    id: 'bot-001',
    name: 'BTC/USDT Scalper',
    strategy: 'Scalping Momentum',
    status: 'active',
    profitPercent: 15.2,
    createdAt: '2024-05-10T10:00:00Z',
  },
  {
    id: 'bot-002',
    name: 'ETH Swing Trader',
    strategy: 'EMA Crossover',
    status: 'inactive',
    profitPercent: -2.5,
    createdAt: '2024-05-08T14:30:00Z',
  },
    {
    id: 'bot-003',
    name: 'SOL Grid Bot',
    strategy: 'Grid Trading',
    status: 'active',
    profitPercent: 8.1,
    createdAt: '2024-05-12T08:15:00Z',
  },
];

export default function BotTradingPage() {
  const [bots, setBots] = useState<TradingBot[]>(initialBots);

  // TODO: Implement functions for creating, editing, deleting bots
  const handleCreateBot = () => {
    console.log('Create new bot');
    // Add logic to open a modal or navigate to a creation page
  };

  const handleToggleStatus = (id: string) => {
    setBots(bots.map(bot =>
      bot.id === id ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' } : bot
    ));
  };

   const handleDeleteBot = (id: string) => {
    setBots(bots.filter(bot => bot.id !== id));
    console.log(`Delete bot ${id}`);
  };

  const getStatusColor = (status: TradingBot['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bot Trading Management
        </h1>
        <button
          onClick={handleCreateBot}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Create New Bot
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bot Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Strategy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bots.map((bot) => (
                <tr key={bot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {bot.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {bot.strategy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${bot.profitPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {bot.profitPercent.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleStatus(bot.id)}
                      className={`mr-2 px-2 py-1 text-xs rounded ${bot.status === 'active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    >
                      {bot.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      // TODO: Implement edit functionality
                      onClick={() => console.log(`Edit bot ${bot.id}`)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBot(bot.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {bots.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No bots configured yet.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 