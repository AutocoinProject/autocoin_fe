"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function UpbitBotPage() {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  
  // 거래 이력 및 잔고 상태 (실제 구현에서는 API 호출로 대체)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'BUY', coin: 'BTC', amount: 0.01, price: 83250000, timestamp: new Date().toISOString() },
    { id: 2, type: 'SELL', coin: 'ETH', amount: 0.5, price: 4150000, timestamp: new Date().toISOString() },
  ]);
  
  const [walletBalance, setWalletBalance] = useState([
    { coin: 'BTC', amount: 0.15, valueKRW: 12487500 },
    { coin: 'ETH', amount: 2.3, valueKRW: 9545000 },
    { coin: 'KRW', amount: 2500000, valueKRW: 2500000 },
  ]);
  
  // 사용 가능한 코인 및 전략 목록 (한국 거래소용)
  const availableCoins = ['BTC', 'ETH', 'XRP', 'ETC', 'ADA', 'SOL', 'DOGE', 'MATIC', 'DOT', 'AVAX'];
  const availableStrategies = ['RSI', 'MACD', '이동평균선', '볼린저밴드', 'AI 전략'];
  
  const handleSaveApiKeys = () => {
    // API 키 저장 로직 (실제 구현시 안전한 방식으로 저장)
    console.log('API Keys saved:', { apiKey, secretKey });
    alert('API 키가 저장되었습니다.');
  };
  
  const handleCoinSelection = (coin: string) => {
    if (selectedCoins.includes(coin)) {
      setSelectedCoins(selectedCoins.filter(c => c !== coin));
    } else {
      setSelectedCoins([...selectedCoins, coin]);
    }
  };
  
  const handleStrategySelection = (strategy: string) => {
    if (selectedStrategies.includes(strategy)) {
      setSelectedStrategies(selectedStrategies.filter(s => s !== strategy));
    } else {
      setSelectedStrategies([...selectedStrategies, strategy]);
    }
  };
  
  const handleAutomaticCoinSelection = () => {
    // 상위 5개 코인 자동 선택 (실제로는 API를 통해 가져와야 함)
    setSelectedCoins(['BTC', 'ETH', 'XRP', 'SOL', 'ADA']);
  };
  
  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-bold mb-6">업비트 트레이딩 봇</h1>
      
      {/* API Key 입력 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">API Key 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Access Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="업비트 Access Key 입력"
            />
          </div>
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secret Key
            </label>
            <input
              type="password"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="업비트 Secret Key 입력"
            />
          </div>
        </div>
        <button
          onClick={handleSaveApiKeys}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          저장
        </button>
      </div>
      
      {/* 코인 선택 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">코인 선택</h2>
          <button
            onClick={handleAutomaticCoinSelection}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
          >
            상위 코인 자동 선택
          </button>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {availableCoins.map((coin) => (
            <button
              key={coin}
              onClick={() => handleCoinSelection(coin)}
              className={`flex items-center justify-center p-2 rounded-md ${
                selectedCoins.includes(coin)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="font-medium">{coin}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 전략 선택 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">전략 선택</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {availableStrategies.map((strategy) => (
            <button
              key={strategy}
              onClick={() => handleStrategySelection(strategy)}
              disabled={strategy === 'AI 전략'}
              className={`p-3 rounded-md ${
                strategy === 'AI 전략'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : selectedStrategies.includes(strategy)
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border border-green-300 dark:border-green-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {strategy}
              {strategy === 'AI 전략' && <span className="ml-2 text-xs">(준비중)</span>}
            </button>
          ))}
        </div>
      </div>
      
      {/* 메인 대시보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 매수/매도 이력 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">최근 거래 내역</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">타입</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">코인</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">수량</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">가격 (KRW)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">시간</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      tx.type === 'BUY' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {tx.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{tx.coin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{tx.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{tx.price.toLocaleString()} 원</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 지갑 잔고 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">지갑 잔고</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">코인</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">수량</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">KRW 가치</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {walletBalance.map((balance, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">{balance.coin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{balance.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{balance.valueKRW.toLocaleString()} 원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
