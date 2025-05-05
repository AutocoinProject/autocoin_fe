"use client";

import React from 'react';
import Image from 'next/image';

interface CoinCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: string;
}

export default function CoinCard({ name, symbol, price, change, icon }: CoinCardProps) {
  // Format price with appropriate decimal places
  const formattedPrice = price >= 1000 
    ? price.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 6 : 2 });
  
  // Determine if change is positive or negative
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-3">
          <Image src={icon} alt={name} width={32} height={32} />
        </div>
        <div>
          <h3 className="font-medium text-gray-800 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{symbol}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">${formattedPrice}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${
          isPositive 
            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          <span className="flex items-center">
            {isPositive ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="w-4 h-4 mr-1"
              >
                <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path fillRule="evenodd" d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            )}
            {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
