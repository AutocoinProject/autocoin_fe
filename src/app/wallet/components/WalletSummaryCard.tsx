"use client";

import React from 'react';

interface Asset {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  icon: string;
  change: number;
}

interface WalletSummaryCardProps {
  data: {
    totalBalance: number;
    change: number;
    assets: Asset[];
  };
}

export default function WalletSummaryCard({ data }: WalletSummaryCardProps) {
  const { totalBalance, change, assets } = data;
  
  // Calculate top assets for display
  const topAssets = [...assets]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
    
  // Calculate percentages for pie chart
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const assetPercentages = assets.map(asset => ({
    ...asset,
    percentage: (asset.value / totalValue) * 100
  }));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Balance</h3>
        <div className="flex items-center mb-4">
          <p className="text-3xl font-bold text-gray-800 dark:text-white mr-2">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            change >= 0 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
        
        <div className="flex flex-col space-y-4">
          {topAssets.map(asset => (
            <div key={asset.id} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                  {/* In a real implementation, you'd use Image component with icon prop */}
                  <span className="text-xs">{asset.symbol}</span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{asset.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
        
        <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Funds
        </button>
      </div>
      
      {/* Portfolio Distribution Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-4">Portfolio Distribution</h3>
        
        <div className="flex justify-center mb-6">
          {/* Placeholder for pie chart - In a real implementation, you'd use a chart library */}
          <div className="h-40 w-40 rounded-full border-8 border-blue-500 relative flex items-center justify-center">
            <div className="absolute inset-0 border-t-8 border-r-8 border-green-500 rounded-full rotate-45"></div>
            <div className="absolute inset-0 border-b-8 border-l-8 border-yellow-500 rounded-full -rotate-45"></div>
            <div className="absolute inset-0 border-l-8 border-t-8 border-purple-500 rounded-full rotate-[135deg]"></div>
            <span className="text-sm font-medium text-gray-800 dark:text-white">Distribution</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {assetPercentages.slice(0, 4).map(asset => (
            <div key={asset.id} className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: getAssetColor(asset.name) }}
              />
              <div className="flex justify-between w-full">
                <span className="text-sm text-gray-700 dark:text-gray-300">{asset.name}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{asset.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
          
          {assetPercentages.length > 4 && (
            <div className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2 bg-gray-400"
              />
              <div className="flex justify-between w-full">
                <span className="text-sm text-gray-700 dark:text-gray-300">Others</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {assetPercentages.slice(4).reduce((sum, asset) => sum + asset.percentage, 0).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-white">Buy</span>
          </button>
          
          <button className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-white">Sell</span>
          </button>
          
          <button className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-white">Swap</span>
          </button>
          
          <button className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-white">History</span>
          </button>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Network Fee</h4>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md">
                Slow
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                Normal
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                Fast
              </button>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">~0.0005 BTC</span>
          </div>
        </div>
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
    'USD Coin': '#2775CA',
    'Ripple': '#23292F',
    'Polkadot': '#E6007A',
    'Other': '#6B7280'
  };
  
  return colors[name] || '#6B7280';
}
