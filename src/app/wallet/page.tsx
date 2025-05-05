import React from 'react';
import WalletSummaryCard from './components/WalletSummaryCard';

export default function WalletPage() {
  // Sample wallet data
  const walletData = {
    totalBalance: 24567.89,
    change: 3.42,
    assets: [
      { id: 1, name: 'Bitcoin', symbol: 'BTC', balance: 0.42, value: 26649.92, icon: '/icons/btc.svg', change: 2.34 },
      { id: 2, name: 'Ethereum', symbol: 'ETH', balance: 5.7, value: 18723.08, icon: '/icons/eth.svg', change: -1.52 },
      { id: 3, name: 'Solana', symbol: 'SOL', balance: 45.8, value: 6724.36, icon: '/icons/sol.svg', change: 5.68 },
      { id: 4, name: 'Cardano', symbol: 'ADA', balance: 2500, value: 1370.00, icon: '/icons/ada.svg', change: -0.72 },
      { id: 5, name: 'USD Coin', symbol: 'USDC', balance: 1500, value: 1500.00, icon: '/icons/usdc.svg', change: 0.01 },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Wallet</h1>
        
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
            </svg>
            Send
          </button>
          
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
            </svg>
            Receive
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Swap
          </button>
        </div>
      </div>
      
      {/* Wallet Summary */}
      <WalletSummaryCard data={walletData} />
      
      {/* Assets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Your Assets</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-white rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <select className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
              <option>All Assets</option>
              <option>Tokens</option>
              <option>NFTs</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {walletData.assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 mr-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {/* In a real implementation, you'd use Image component with icon prop */}
                          <span className="text-sm">{asset.symbol}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {asset.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                    {asset.balance.toLocaleString('en-US', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8
                    })} {asset.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                    ${(asset.value / asset.balance).toLocaleString('en-US', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-800 dark:text-white">
                    ${asset.value.toLocaleString('en-US', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      asset.change >= 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-3">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        Send
                      </button>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        Receive
                      </button>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        Trade
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Activity</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Activity items */}
          <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Purchased Bitcoin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">May 5, 2025, 10:30 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">+0.25 BTC</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">$15,863.05</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Sold Ethereum</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">May 4, 2025, 3:45 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">-2.5 ETH</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">$8,211.88</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Received Payment</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">May 3, 2025, 8:12 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">+5,000 USDC</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">$5,000.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
