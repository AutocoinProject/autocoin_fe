"use client";

import React from 'react';

interface Asset {
  name: string;
  symbol?: string;
  value: number;
  percentage: number;
}

interface PortfolioCardProps {
  totalValue: number;
  change: number;
  assets: Asset[];
}

export default function PortfolioCard({ totalValue, change, assets }: PortfolioCardProps) {
  // Determine if change is positive or negative
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          Portfolio
        </h3>
        <select className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-gray-300 rounded-lg text-sm p-2 focus:ring-2 focus:ring-blue-500">
          <option>All Time</option>
          <option>This Year</option>
          <option>This Month</option>
          <option>This Week</option>
        </select>
      </div>
      
      <div className="flex items-end mb-6">
        <div className="mr-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${
          isPositive 
            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          <span className="flex items-center">
            {isPositive ? '+' : ''}
            {change.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.name} className="flex items-center">
            <div 
              className="h-4 rounded-full mr-3" 
              style={{ 
                width: `${asset.percentage}%`, 
                backgroundColor: getAssetColor(asset.name) 
              }}
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {asset.name} {asset.symbol ? `(${asset.symbol})` : ''}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {asset.percentage}%
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get color for each asset
function getAssetColor(name: string): string {
  const colors: Record<string, string> = {
    'Bitcoin': '#F7931A',
    'Ethereum': '#627EEA',
    'Solana': '#14F195',
    'Cardano': '#0033AD',
    'Ripple': '#23292F',
    'Polkadot': '#E6007A',
    'Others': '#6B7280'
  };
  
  return colors[name] || '#6B7280';
}
