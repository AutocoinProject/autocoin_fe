// API Constants

// Base URL for API requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.autocoin.example.com';

// API request timeout in milliseconds
export const API_TIMEOUT = 30000; // 30 seconds

// Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PASSWORD_RESET: '/auth/password-reset',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    NOTIFICATIONS: '/user/notifications',
    SECURITY: '/user/security',
    TWO_FACTOR: '/user/two-factor',
  },
  
  // Market Data
  MARKET: {
    COINS: '/market/coins',
    COIN_DETAIL: (id: string) => `/market/coins/${id}`,
    CHART_DATA: (id: string, timeframe: string) => `/market/coins/${id}/chart/${timeframe}`,
    GLOBAL: '/market/global',
    TRENDING: '/market/trending',
  },
  
  // Portfolio
  PORTFOLIO: {
    SUMMARY: '/portfolio/summary',
    ASSETS: '/portfolio/assets',
    PERFORMANCE: '/portfolio/performance',
    HISTORY: '/portfolio/history',
  },
  
  // Transactions
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAIL: (id: string) => `/transactions/${id}`,
    CREATE: '/transactions',
    HISTORY: '/transactions/history',
  },
  
  // Wallet
  WALLET: {
    LIST: '/wallets',
    DETAIL: (id: string) => `/wallets/${id}`,
    CREATE: '/wallets',
    ADDRESSES: (id: string) => `/wallets/${id}/addresses`,
    GENERATE_ADDRESS: (id: string) => `/wallets/${id}/addresses/generate`,
  },
  
  // News
  NEWS: {
    ARTICLES: '/news/articles',
    ARTICLE: (id: string) => `/news/articles/${id}`,
    CATEGORIES: '/news/categories',
  },
  
  // Messages
  MESSAGES: {
    LIST: '/messages',
    DETAIL: (id: string) => `/messages/${id}`,
    SEND: '/messages',
    UNREAD: '/messages/unread',
  },
};

// Error Messages
export const API_ERROR_MESSAGES = {
  DEFAULT: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Validation error. Please check your input.',
};

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  MARKET_DATA: 60000,        // 1 minute
  PORTFOLIO: 300000,         // 5 minutes
  TRANSACTIONS: 60000,       // 1 minute
  NOTIFICATIONS: 30000,      // 30 seconds
  TRENDING_COINS: 600000,    // 10 minutes
};
