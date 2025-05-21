"use client";

import React, { useState } from 'react';

export default function ChartCard() {
  const [timeframe, setTimeframe] = useState('1W');
  
  // Timeframe options
  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'All'];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Price Chart
          </h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-gray-800 dark:text-white mr-2">
              $63,452.18
            </span>
            <span className="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-sm">
              +2.34%
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart placeholder - In a real implementation, you would use a chart library like recharts, chart.js, etc. */}
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Chart Placeholder - Will use recharts or chart.js in real implementation</p>
      </div>
      
      <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span>May 1, 2025</span>
        <span>May 5, 2025</span>
      </div>
    </div>
  );
}
