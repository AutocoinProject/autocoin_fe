import React from 'react';
import TransactionTable from './components/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions</h1>
        
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Transaction
          </button>
        </div>
      </div>
      
      {/* Transaction summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Purchases</h3>
          <p className="text-xl font-bold text-gray-800 dark:text-white">$12,485.65</p>
          <div className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            +8.2% from last month
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Sales</h3>
          <p className="text-xl font-bold text-gray-800 dark:text-white">$8,237.42</p>
          <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
            </svg>
            -3.4% from last month
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Net Profit/Loss</h3>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">+$4,248.23</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span>$10,000</span>
          </div>
        </div>
      </div>
      
      {/* Transaction filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <select 
              id="date-range" 
              className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
              <option>Custom range</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select 
              id="type" 
              className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>All Types</option>
              <option>Buy</option>
              <option>Sell</option>
              <option>Transfer</option>
              <option>Deposit</option>
              <option>Withdrawal</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select 
              id="status" 
              className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="coin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cryptocurrency
            </label>
            <select 
              id="coin" 
              className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>All Coins</option>
              <option>Bitcoin (BTC)</option>
              <option>Ethereum (ETH)</option>
              <option>Solana (SOL)</option>
              <option>Cardano (ADA)</option>
              <option>Ripple (XRP)</option>
            </select>
          </div>
          
          <div className="self-end">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Transaction table */}
      <TransactionTable />
    </div>
  );
}
