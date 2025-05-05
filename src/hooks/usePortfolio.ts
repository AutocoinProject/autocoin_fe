"use client";

import { useState, useEffect, useCallback } from 'react';
import useMarketData from './useMarketData';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  image: string;
}

interface PortfolioState {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  isLoading: boolean;
  error: string | null;
}

export default function usePortfolio() {
  const { coins, isLoading: isMarketDataLoading } = useMarketData();
  
  const [portfolioState, setPortfolioState] = useState<PortfolioState>({
    assets: [],
    totalValue: 0,
    totalChange24h: 0,
    isLoading: true,
    error: null
  });

  // Function to fetch portfolio data
  const fetchPortfolio = useCallback(async () => {
    setPortfolioState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to fetch user's portfolio
      // For now, let's simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock portfolio holdings
      const mockHoldings = [
        { id: 'bitcoin', amount: 0.42 },
        { id: 'ethereum', amount: 5.7 },
        { id: 'solana', amount: 45.8 },
        { id: 'cardano', amount: 2500 },
      ];
      
      // Calculate portfolio values based on market data
      if (coins.length === 0) {
        throw new Error('Market data not available');
      }
      
      const assets: Asset[] = mockHoldings
        .map(holding => {
          const coinData = coins.find(coin => coin.id === holding.id);
          
          if (!coinData) return null;
          
          const value = holding.amount * coinData.current_price;
          
          return {
            id: coinData.id,
            name: coinData.name,
            symbol: coinData.symbol,
            amount: holding.amount,
            value,
            price: coinData.current_price,
            change24h: coinData.price_change_percentage_24h,
            image: coinData.image
          };
        })
        .filter((asset): asset is Asset => asset !== null);
      
      // Calculate totals
      const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
      
      // Calculate weighted average change
      const totalChange24h = assets.reduce((sum, asset) => {
        const weight = asset.value / totalValue;
        return sum + (asset.change24h * weight);
      }, 0);
      
      setPortfolioState({
        assets,
        totalValue,
        totalChange24h,
        isLoading: false,
        error: null
      });
    } catch (err) {
      setPortfolioState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch portfolio data'
      }));
    }
  }, [coins]);

  // Fetch portfolio when market data is available
  useEffect(() => {
    if (!isMarketDataLoading && coins.length > 0) {
      fetchPortfolio();
    }
  }, [fetchPortfolio, isMarketDataLoading, coins]);

  // Function to add a transaction
  const addTransaction = useCallback(async (type: 'buy' | 'sell', coinId: string, amount: number, price: number) => {
    setPortfolioState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to record the transaction
      // For now, let's simulate a delay and update the local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the coin in our portfolio
      const existingAssetIndex = portfolioState.assets.findIndex(asset => asset.id === coinId);
      
      if (existingAssetIndex === -1 && type === 'sell') {
        throw new Error(`Cannot sell ${coinId} as it doesn't exist in the portfolio`);
      }
      
      // Clone the assets array
      const updatedAssets = [...portfolioState.assets];
      
      if (existingAssetIndex === -1 && type === 'buy') {
        // Add new asset
        const coinData = coins.find(coin => coin.id === coinId);
        
        if (!coinData) {
          throw new Error(`Coin with ID ${coinId} not found in market data`);
        }
        
        updatedAssets.push({
          id: coinData.id,
          name: coinData.name,
          symbol: coinData.symbol,
          amount,
          value: amount * price,
          price,
          change24h: coinData.price_change_percentage_24h,
          image: coinData.image
        });
      } else {
        // Update existing asset
        const asset = updatedAssets[existingAssetIndex];
        
        if (type === 'buy') {
          asset.amount += amount;
        } else {
          asset.amount -= amount;
          
          // Remove asset if amount becomes zero or negative
          if (asset.amount <= 0) {
            updatedAssets.splice(existingAssetIndex, 1);
          }
        }
        
        // Update value if asset still exists
        if (asset.amount > 0) {
          asset.value = asset.amount * price;
        }
      }
      
      // Recalculate totals
      const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
      
      // Recalculate weighted average change
      const totalChange24h = updatedAssets.reduce((sum, asset) => {
        const weight = asset.value / totalValue;
        return sum + (asset.change24h * weight);
      }, 0);
      
      setPortfolioState({
        assets: updatedAssets,
        totalValue,
        totalChange24h,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to process transaction';
      
      setPortfolioState(prev => ({
        ...prev,
        isLoading: false,
        error
      }));
      
      return false;
    }
  }, [portfolioState.assets, coins]);

  return {
    ...portfolioState,
    fetchPortfolio,
    addTransaction
  };
}
