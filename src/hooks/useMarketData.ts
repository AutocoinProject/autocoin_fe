"use client";

import { useState, useEffect, useCallback } from 'react';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  last_updated: string;
}

interface MarketDataState {
  coins: CoinData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export default function useMarketData(refreshInterval = 60000) {
  const [marketData, setMarketData] = useState<MarketDataState>({
    coins: [],
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  // Function to fetch market data
  const fetchMarketData = useCallback(async () => {
    setMarketData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to fetch live market data
      // For now, let's simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock market data
      const mockData: CoinData[] = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          current_price: 63452.18,
          price_change_percentage_24h: 2.34,
          market_cap: 1235678945123,
          total_volume: 42768945123,
          image: '/icons/btc.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          current_price: 3284.75,
          price_change_percentage_24h: -1.52,
          market_cap: 384512345678,
          total_volume: 21345678901,
          image: '/icons/eth.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'solana',
          name: 'Solana',
          symbol: 'SOL',
          current_price: 146.82,
          price_change_percentage_24h: 5.68,
          market_cap: 62345678901,
          total_volume: 8765432109,
          image: '/icons/sol.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'cardano',
          name: 'Cardano',
          symbol: 'ADA',
          current_price: 0.548,
          price_change_percentage_24h: -0.72,
          market_cap: 19234567890,
          total_volume: 2345678901,
          image: '/icons/ada.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'ripple',
          name: 'XRP',
          symbol: 'XRP',
          current_price: 0.674,
          price_change_percentage_24h: 1.23,
          market_cap: 34567890123,
          total_volume: 4567890123,
          image: '/icons/xrp.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'polkadot',
          name: 'Polkadot',
          symbol: 'DOT',
          current_price: 7.84,
          price_change_percentage_24h: 3.45,
          market_cap: 9876543210,
          total_volume: 1234567890,
          image: '/icons/dot.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'binancecoin',
          name: 'Binance Coin',
          symbol: 'BNB',
          current_price: 582.38,
          price_change_percentage_24h: 0.85,
          market_cap: 89012345678,
          total_volume: 9876543210,
          image: '/icons/bnb.svg',
          last_updated: new Date().toISOString()
        },
        {
          id: 'dogecoin',
          name: 'Dogecoin',
          symbol: 'DOGE',
          current_price: 0.132,
          price_change_percentage_24h: -2.54,
          market_cap: 18765432109,
          total_volume: 2345678901,
          image: '/icons/doge.svg',
          last_updated: new Date().toISOString()
        },
      ];
      
      setMarketData({
        coins: mockData,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (err) {
      setMarketData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch market data'
      }));
    }
  }, []);

  // Function to fetch data for a specific coin
  const fetchCoinData = useCallback(async (coinId: string) => {
    setMarketData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to fetch specific coin data
      // For now, let's simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the coin in our mock data
      const coin = marketData.coins.find(c => c.id === coinId);
      
      if (!coin) {
        throw new Error(`Coin with ID ${coinId} not found`);
      }
      
      // Return the single coin data
      return coin;
    } catch (err) {
      setMarketData(prev => ({
        ...prev,
        isLoading: false,
        error: `Failed to fetch data for ${coinId}`
      }));
      return null;
    }
  }, [marketData.coins]);

  // Set up auto-refresh interval
  useEffect(() => {
    // Initial fetch
    fetchMarketData();
    
    // Set up interval for auto-refresh if interval is greater than 0
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchMarketData, refreshInterval);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [fetchMarketData, refreshInterval]);

  return {
    ...marketData,
    fetchMarketData,
    fetchCoinData
  };
}
