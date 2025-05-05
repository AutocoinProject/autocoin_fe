import React from 'react';
import CoinCard from './components/CoinCard';
import PortfolioCard from './components/PortfolioCard';
import CreditCard from './components/CreditCard';
import ChartCard from './components/ChartCard';
import LiveMarketTable from './components/LiveMarketTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      {/* First row - Coin cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CoinCard 
          name="Bitcoin" 
          symbol="BTC" 
          price={63452.18} 
          change={2.34} 
          icon="/icons/btc.svg"
        />
        <CoinCard 
          name="Ethereum" 
          symbol="ETH" 
          price={3284.75} 
          change={-1.52} 
          icon="/icons/eth.svg"
        />
        <CoinCard 
          name="Solana" 
          symbol="SOL" 
          price={146.82} 
          change={5.68} 
          icon="/icons/sol.svg"
        />
        <CoinCard 
          name="Cardano" 
          symbol="ADA" 
          price={0.548} 
          change={-0.72} 
          icon="/icons/ada.svg"
        />
      </div>
      
      {/* Second row - Portfolio and Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioCard 
            totalValue={15834.29} 
            change={3.7} 
            assets={[
              { name: 'Bitcoin', symbol: 'BTC', value: 8254.12, percentage: 52 },
              { name: 'Ethereum', symbol: 'ETH', value: 4972.36, percentage: 31 },
              { name: 'Solana', symbol: 'SOL', value: 1823.94, percentage: 12 },
              { name: 'Others', value: 783.87, percentage: 5 }
            ]} 
          />
        </div>
        <div>
          <CreditCard 
            number="**** **** **** 4589"
            name="John Doe"
            expiry="12/27"
          />
        </div>
      </div>
      
      {/* Third row - Chart and Market */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard />
        </div>
        <div>
          <LiveMarketTable />
        </div>
      </div>
    </div>
  );
}
