"use client";

import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'transfer' | 'deposit' | 'withdrawal';
  coin: {
    name: string;
    symbol: string;
    icon: string;
  };
  amount: number;
  price: number;
  total: number;
  status: 'completed' | 'pending' | 'failed';
}

export default function TransactionTable() {
  // Sample data for the table
  const transactions: Transaction[] = [
    {
      id: 'TX123456789',
      date: '2025-05-05T10:30:00',
      type: 'buy',
      coin: { name: 'Bitcoin', symbol: 'BTC', icon: '/icons/btc.svg' },
      amount: 0.25,
      price: 63452.18,
      total: 15863.05,
      status: 'completed'
    },
    {
      id: 'TX123456790',
      date: '2025-05-04T15:45:00',
      type: 'sell',
      coin: { name: 'Ethereum', symbol: 'ETH', icon: '/icons/eth.svg' },
      amount: 2.5,
      price: 3284.75,
      total: 8211.88,
      status: 'completed'
    },
    {
      id: 'TX123456791',
      date: '2025-05-03T08:12:00',
      type: 'deposit',
      coin: { name: 'USD Coin', symbol: 'USDC', icon: '/icons/usdc.svg' },
      amount: 5000,
      price: 1,
      total: 5000,
      status: 'completed'
    },
    {
      id: 'TX123456792',
      date: '2025-05-02T19:28:00',
      type: 'transfer',
      coin: { name: 'Solana', symbol: 'SOL', icon: '/icons/sol.svg' },
      amount: 10,
      price: 146.82,
      total: 1468.20,
      status: 'pending'
    },
    {
      id: 'TX123456793',
      date: '2025-05-01T12:33:00',
      type: 'withdrawal',
      coin: { name: 'Bitcoin', symbol: 'BTC', icon: '/icons/btc.svg' },
      amount: 0.1,
      price: 62845.32,
      total: 6284.53,
      status: 'failed'
    },
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTypeStyles = (type: Transaction['type']) => {
    const styles = {
      buy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      sell: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      deposit: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      withdrawal: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    
    return styles[type] || '';
  };
  
  const getStatusStyles = (status: Transaction['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return styles[status] || '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeStyles(transaction.type)}`}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 mr-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {/* In a real implementation, you'd use Image component with icon prop */}
                        <span className="text-xs">{transaction.coin.symbol}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {transaction.coin.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.coin.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                  {transaction.amount.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                  })} {transaction.coin.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                  ${transaction.price.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: transaction.price < 1 ? 6 : 2
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-800 dark:text-white">
                  ${transaction.total.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{1}</span> to <span className="font-medium">{Math.min(itemsPerPage, transactions.length)}</span> of <span className="font-medium">{transactions.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
