import React from 'react';
import PriceLineChart from './components/PriceLineChart';

export default function ChartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Market Charts</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Chart Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="coin-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cryptocurrency
              </label>
              <select 
                id="coin-select" 
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 min-w-[180px]"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="ADA">Cardano (ADA)</option>
                <option value="XRP">Ripple (XRP)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select 
                id="currency-select" 
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white">1D</button>
            <button className="px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">1W</button>
            <button className="px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">1M</button>
            <button className="px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">3M</button>
            <button className="px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">1Y</button>
            <button className="px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">All</button>
          </div>
        </div>
        
        {/* Chart Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mr-2">Bitcoin (BTC)</h2>
            <span className="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-sm">
              +2.34%
            </span>
          </div>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-bold text-gray-800 dark:text-white mr-2">$63,452.18</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: May 5, 2025, 12:34 PM</span>
          </div>
        </div>
        
        {/* Chart Component */}
        <PriceLineChart />
        
        {/* Trading Volume */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Trading Volume</h3>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Volume Chart Placeholder</p>
          </div>
        </div>
      </div>
      
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Market Cap</h3>
          <p className="text-xl font-bold text-gray-800 dark:text-white">$1.23T</p>
          <p className="text-sm text-green-600 dark:text-green-400">+1.45% (24h)</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">24h Trading Volume</h3>
          <p className="text-xl font-bold text-gray-800 dark:text-white">$42.7B</p>
          <p className="text-sm text-red-600 dark:text-red-400">-3.12% (24h)</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Circulating Supply</h3>
          <p className="text-xl font-bold text-gray-800 dark:text-white">19.4M BTC</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">92% of max supply (21M)</p>
        </div>
      </div>
    </div>
  );
}
