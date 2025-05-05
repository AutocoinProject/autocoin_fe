// Chart utilities

export interface ChartDataPoint {
  timestamp: number;  // Unix timestamp in milliseconds
  value: number;
}

export interface ChartOptions {
  timeframe?: '1H' | '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  showGrid?: boolean;
  showTooltip?: boolean;
  lineColor?: string;
  fillColor?: string;
  height?: number;
  width?: number;
}

// Function to generate random chart data
export function generateRandomChartData(
  timeframe: '1H' | '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL' = '1D', 
  baseValue = 60000,
  volatility = 0.02
): ChartDataPoint[] {
  const now = Date.now();
  const data: ChartDataPoint[] = [];
  let value = baseValue;
  
  // Determine the number of data points and interval between them based on timeframe
  let numPoints: number;
  let interval: number;
  
  switch (timeframe) {
    case '1H':
      numPoints = 60;       // One point per minute
      interval = 60 * 1000; // 1 minute in milliseconds
      break;
    case '1D':
      numPoints = 24;         // One point per hour
      interval = 60 * 60 * 1000; // 1 hour in milliseconds
      break;
    case '1W':
      numPoints = 7;             // One point per day
      interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case '1M':
      numPoints = 30;            // One point per day
      interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case '3M':
      numPoints = 90;            // One point per day
      interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case '1Y':
      numPoints = 12;            // One point per month
      interval = 30 * 24 * 60 * 60 * 1000; // Approximately 1 month in milliseconds
      break;
    case 'ALL':
      numPoints = 52;            // One point per week for ~5 years
      interval = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      break;
    default:
      numPoints = 24;
      interval = 60 * 60 * 1000;
  }
  
  // Generate data points
  for (let i = numPoints - 1; i >= 0; i--) {
    const timestamp = now - (i * interval);
    
    // Add some randomness to the value
    const changePercent = (Math.random() - 0.5) * volatility;
    value = value * (1 + changePercent);
    
    data.push({ timestamp, value });
  }
  
  return data;
}

// Function to format dates for chart labels
export function formatChartDate(timestamp: number, timeframe: '1H' | '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'): string {
  const date = new Date(timestamp);
  
  switch (timeframe) {
    case '1H':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '1D':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '1W':
    case '1M':
    case '3M':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case '1Y':
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    case 'ALL':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    default:
      return date.toLocaleString();
  }
}

// Function to format price values
export function formatChartValue(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

// Calculate percentage change between two values
export function calculatePercentChange(startValue: number, endValue: number): number {
  if (startValue === 0) return 0;
  return ((endValue - startValue) / startValue) * 100;
}

// Function to get min/max values from chart data
export function getChartBounds(data: ChartDataPoint[]): { min: number; max: number } {
  if (data.length === 0) {
    return { min: 0, max: 0 };
  }
  
  let min = data[0].value;
  let max = data[0].value;
  
  for (const point of data) {
    if (point.value < min) {
      min = point.value;
    }
    if (point.value > max) {
      max = point.value;
    }
  }
  
  // Add some padding
  const padding = (max - min) * 0.1;
  return {
    min: Math.max(0, min - padding), // Don't go below zero
    max: max + padding
  };
}

// Get trend (up/down/neutral) based on percentage change
export function getTrend(percentChange: number): 'up' | 'down' | 'neutral' {
  if (percentChange > 0.1) return 'up';
  if (percentChange < -0.1) return 'down';
  return 'neutral';
}

// Get color based on trend
export function getTrendColor(trend: 'up' | 'down' | 'neutral', darkMode = false): string {
  if (trend === 'up') return darkMode ? '#34D399' : '#10B981'; // Green
  if (trend === 'down') return darkMode ? '#F87171' : '#EF4444'; // Red
  return darkMode ? '#94A3B8' : '#64748B'; // Gray
}
