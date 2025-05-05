"use client";

import React from 'react';
import Image from 'next/image';

interface Coin {
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: string;
}

export default function LiveMarketTable() {
  // Sample data for the table
  const coins: Coin[] = [
    { name: 'Bitcoin', symbol: 'BTC', price: 63452.18, change: 2.34, icon: '/icons/btc.svg' },
    { name: 'Ethereum', symbol: 'ETH', price: 3284.75, change: -1.52, icon: '/icons/eth.svg' },
    { name: 'Solana', symbol: 'SOL', price: 146.82, change: 5.68, icon: '/icons/sol.svg' },
    { name: 'Cardano', symbol: 'ADA', price: 0.548, change: -0.72, icon: '/icons/ada.svg' },
    { name: 'Ripple', symbol: 'XRP', price: 0.674, change: 1.23, icon: '/icons/xrp.svg' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          Live Market
        </h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="pb-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="pb-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                24h
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr 
                key={coin.symbol} 
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <td className="py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Image src={coin.icon} alt={coin.name} width={24} height={24} className="mr-2" />
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">{coin.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right whitespace-nowrap text-sm text-gray-800 dark:text-white">
                  ${coin.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: coin.price < 1 ? 4 : 2
                  })}
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    coin.change >= 0 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
