"use client";

import { useState, ChangeEvent, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Dynamic import 추가
// useEffect, Image는 현재 불필요

// Plotly 컴포넌트 동적 로딩 (SSR 방지)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// --- 타입 정의 ---

// 업비트 API 요청 파라미터 타입
interface UpbitRequestParams {
  market: string;
  interval: string;
  count: number;
}

// 업비트 API 키 타입
interface ApiKeyParams {
  access_key: string;
  secret_key: string;
}

// 전략 파라미터 타입
interface StrategyParams {
  [key: string]: number | string;
  initial_balance: number | string;
  rsi_period: number | string;
  macd_fast: number | string;
  macd_slow: number | string;
  macd_signal: number | string;
  sma_period: number | string;
  bollinger_period: number | string;
  bollinger_std: number | string;
}

// 거래 내역 타입 정의
interface Trade {
  action: 'BUY' | 'SELL';
  price: number;
  timestamp: string; // 날짜/시간 문자열
}

// 백엔드 /api/backtest/test_run 요청 본문 타입 (새 구조)
interface BacktestRequestBody {
  upbit_request: UpbitRequestParams;
  api_key: ApiKeyParams;
  strategy_params: Record<string, number>; // 최종 전송 시 숫자로 변환
}

// 백엔드 응답 데이터 상세 타입 정의
interface BacktestResultData {
  initial_balance: number;
  final_balance: number;
  return_rate: number; // 퍼센트
  mdd: number; // 퍼센트 (Maximum Drawdown)
  trades: Trade[];
}

// 백엔드 /api/backtest/test_run 응답 타입 (상세화)
interface BacktestTestRunResponse {
  success: boolean;
  message?: string;
  data?: BacktestResultData;
}

// Plotly 데이터 및 레이아웃 타입 (간단하게 any 사용, 필요시 상세화)
interface PlotlyData {
  data: any[];
  layout: any;
}

// --- 컴포넌트 ---

export default function BacktestPage() {
  // --- 상태 변수 ---
  const [market, setMarket] = useState<string>("KRW-BTC");
  const [interval, setInterval] = useState<string>("day");
  const [count, setCount] = useState<string>("100");

  // 업비트 API 키 상태 추가
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");

  // 초기 자본 상태 추가
  const [initialBalance, setInitialBalance] = useState<string>("1000000");

  const [strategyParams, setStrategyParams] = useState<Omit<StrategyParams, 'initial_balance'>>({
    // initial_balance 제외하고 초기화
    rsi_period: 14,
    macd_fast: 12,
    macd_slow: 26,
    macd_signal: 9,
    sma_period: 20,
    bollinger_period: 20,
    bollinger_std: 2.0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResultData | null>(null); // 타입 상세화, 초기값 null
  const [plotData, setPlotData] = useState<PlotlyData | null>(null); // Plotly 상태 추가

  // --- 로컬 스토리지 연동 --- 
  useEffect(() => {
    const storedAccessKey = localStorage.getItem('upbitAccessKey');
    const storedSecretKey = localStorage.getItem('upbitSecretKey');
    if (storedAccessKey) {
      setAccessKey(storedAccessKey);
    }
    if (storedSecretKey) {
      setSecretKey(storedSecretKey);
    }
  }, []); // 컴포넌트 마운트 시 1회 실행

  // --- 초기 자본 조절 핸들러 ---
  const adjustInitialBalance = (amount: number) => {
    setInitialBalance(prev => {
        const currentNum = parseFloat(prev);
        // 현재 값이 유효한 숫자가 아니면 amount 자체를 설정 (0 + amount)
        const newValue = isNaN(currentNum) ? amount : currentNum + amount;
        // 음수 방지
        return Math.max(0, newValue).toString();
    });
  };

  const resetInitialBalance = () => {
      setInitialBalance("1000000"); // 기본값으로 초기화
  };

  // --- 핸들러 ---

  // 전략 파라미터 입력 변경 핸들러
  const handleParamChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    // initial_balance는 별도 상태로 관리하므로 여기서 제외
    if (name !== 'initial_balance') {
        setStrategyParams(prevParams => ({
            ...prevParams,
            [name]: value,
        }));
    }
  };

  // Access Key 변경 핸들러 (localStorage 저장 추가)
  const handleAccessKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    setAccessKey(newKey);
    localStorage.setItem('upbitAccessKey', newKey);
  };

  // Secret Key 변경 핸들러 (localStorage 저장 추가)
  const handleSecretKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    setSecretKey(newKey);
    localStorage.setItem('upbitSecretKey', newKey);
  };

  // 백테스트 시작 핸들러
  const handleBacktest = async () => {
    setIsLoading(true);
    setError(null);
    setBacktestResults(null);
    setPlotData(null);

    // --- 1. 입력값 유효성 검사 ---
    const countNum = parseInt(count, 10);
    const initialBalanceNum = parseFloat(initialBalance); // 초기 자본 파싱

    if (isNaN(countNum) || countNum <= 0 || countNum > 200) {
        alert('데이터 개수(count)는 1 이상 200 이하의 숫자여야 합니다.');
        setIsLoading(false);
        return;
    }
    if (!accessKey || !secretKey) {
        alert('업비트 Access Key와 Secret Key를 모두 입력해주세요.');
        setIsLoading(false);
        return;
    }
    // 초기 자본 유효성 검사 추가
    if (isNaN(initialBalanceNum) || initialBalanceNum <= 0) {
        alert('초기 자본(Initial Balance)은 0보다 큰 숫자여야 합니다.');
        setIsLoading(false);
        return;
    }
    // TODO: market, interval 형식 검증 추가

    // --- 2. 전략 파라미터 숫자 변환 (initial_balance 포함) ---
    const numericStrategyParams: Record<string, number> = {
        initial_balance: initialBalanceNum // 파싱된 초기 자본 추가
    };
    try {
       for (const key in strategyParams) {
         if (Object.prototype.hasOwnProperty.call(strategyParams, key)) {
            const typedKey = key as keyof typeof strategyParams; // 타입 명시
            const parsedValue = parseFloat(strategyParams[typedKey] as string);
            if (isNaN(parsedValue)) {
                throw new Error(`전략 파라미터 '${key}'의 값이 유효한 숫자가 아닙니다: ${strategyParams[typedKey]}`);
            }
            numericStrategyParams[key] = parsedValue;
         }
       }
    } catch(parseError: any) {
        alert(parseError.message);
        setIsLoading(false);
        return;
    }

    // --- 3. 백엔드 API 요청 본문 구성 ---
    const requestBody: BacktestRequestBody = {
      upbit_request: {
          market: market,
          interval: interval,
          count: countNum,
      },
      api_key: {
          access_key: accessKey,
          secret_key: secretKey,
      },
      strategy_params: numericStrategyParams, // 업데이트된 파라미터 사용
    };

    // API URL 경로에 v1 추가
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/backtest/test_run`;

    console.log(`Requesting Backend API: ${apiUrl}`);
    console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // 전체 본문 로그 (키 포함 주의)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Backend Response Status: ${response.status}, OK: ${response.ok}`);
      const responseText = await response.text();
      console.log('Raw Backend Response Text:', responseText);

      let responseData: BacktestTestRunResponse;
      try {
         responseData = JSON.parse(responseText);
         console.log('Parsed Backend Response Data:', responseData);
      } catch (jsonError) {
          console.error('Failed to parse backend response as JSON:', jsonError);
          setError('백엔드 응답을 처리하는 중 오류가 발생했습니다. (JSON 파싱 실패)');
          setIsLoading(false);
          return;
      }

      // --- 4. 백엔드 응답 처리 ---
      if (responseData.success && responseData.data) {
        setBacktestResults(responseData.data);
        // Plotly 데이터 준비 및 상태 업데이트
        const preparedPlotData = preparePlotData(responseData.data);
        setPlotData(preparedPlotData);
      } else {
        const errorMessage = responseData.message || `백테스트 요청 실패 (응답 코드: ${response.status})`;
        setError(errorMessage);
        console.log('API Error Message from Server:', responseData.message);
      }
    } catch (err) {
      console.error('Backend API call failed:', err);
      const errorMessage = '백엔드 서버에 연결할 수 없거나 응답을 받지 못했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 유틸리티 함수 (숫자 포맷팅) ---
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // --- 공통 입력 스타일 --- (복원)
  const inputBaseStyle = "block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 sm:text-sm";
  const labelBaseStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const paramLabelStyle = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";
  const paramInputStyle = `block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 sm:text-xs`;

  // 버튼 스타일 추가 (작은 버튼용)
  const smallButtonStyle = "px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors";

  // --- 차트 데이터 준비 함수 ---
  const preparePlotData = (results: BacktestResultData): PlotlyData | null => {
    if (!results || !results.trades || results.trades.length === 0) {
      return null;
    }

    const buyTrades = results.trades.filter(t => t.action === 'BUY');
    const sellTrades = results.trades.filter(t => t.action === 'SELL');

    const buyTrace = {
      x: buyTrades.map(t => new Date(t.timestamp)),
      y: buyTrades.map(t => t.price),
      mode: 'markers',
      type: 'scatter',
      name: 'Buy',
      marker: { color: 'green', size: 8 },
    };

    const sellTrace = {
      x: sellTrades.map(t => new Date(t.timestamp)),
      y: sellTrades.map(t => t.price),
      mode: 'markers',
      type: 'scatter',
      name: 'Sell',
      marker: { color: 'red', size: 8 },
    };

    const layout = {
      title: '거래 시점 및 가격',
      xaxis: { title: '시간' },
      yaxis: { title: '가격 (KRW)' }, // 축 제목 추가
      showlegend: true,
      // 다크 모드 대응 (간단히 배경색만)
      paper_bgcolor: 'rgba(0,0,0,0)', // 투명
      plot_bgcolor: 'rgba(0,0,0,0)', // 투명
      font: { color: '#374151' }, // 기본 글자색 (다크모드 고려 필요)
      // 참고: 실제 다크모드 대응은 테마 상태에 따라 동적으로 변경 필요
    };

    return {
      data: [buyTrace, sellTrace],
      layout: layout,
    };
  };

  // --- JSX --- (UI 개선 스타일 재적용)
  return (
    <div className="p-4 sm:p-6 lg:p-8"> {/* 전체 너비 사용 */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">백테스트 요청</h1>

      {/* 설정 섹션 카드 (복원) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">입력 파라미터</h2>

            {/* API 조회 조건 섹션 (스타일 복원) */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Upbit API 조회 조건</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4">
                    <div>
                        <label htmlFor="marketInput" className={labelBaseStyle}>Market (예: KRW-BTC)</label>
                        <input id="marketInput" type="text" value={market} onChange={(e) => setMarket(e.target.value)} className={inputBaseStyle} />
                    </div>
                    <div>
                        <label htmlFor="intervalSelect" className={labelBaseStyle}>Interval</label>
                        <select id="intervalSelect" value={interval} onChange={(e) => setInterval(e.target.value)} className={inputBaseStyle}>
                           <option value="minute1">1분</option>
                           <option value="minute3">3분</option>
                           <option value="minute5">5분</option>
                           <option value="minute10">10분</option>
                           <option value="minute15">15분</option>
                           <option value="minute30">30분</option>
                           <option value="hour1">1시간</option>
                           <option value="hour4">4시간</option>
                           <option value="day">일</option>
                           <option value="week">주</option>
                           <option value="month">월</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="countInput" className={labelBaseStyle}>Count (1-200)</label>
                        <input id="countInput" type="number" value={count} onChange={(e) => setCount(e.target.value)} max="200" min="1" className={inputBaseStyle} />
                    </div>
                </div>
            </div>

            {/* Upbit 인증 정보 섹션 (스타일 복원) */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Upbit 인증 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                        <label htmlFor="accessKeyInput" className={labelBaseStyle}>Access Key</label>
                        <input
                           id="accessKeyInput"
                           type="password"
                           value={accessKey}
                           onChange={handleAccessKeyChange}
                           className={inputBaseStyle}
                           placeholder="업비트 Access Key"
                        />
                    </div>
                    <div>
                        <label htmlFor="secretKeyInput" className={labelBaseStyle}>Secret Key</label>
                        <input
                           id="secretKeyInput"
                           type="password"
                           value={secretKey}
                           onChange={handleSecretKeyChange}
                           className={inputBaseStyle}
                           placeholder="업비트 Secret Key"
                        />
                    </div>
                </div>
            </div>

            {/* 전략 파라미터 섹션 (initial_balance 추가) */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">전략 파라미터</h3>
                <div className="space-y-5">
                    {/* Initial Balance Input with Buttons and Display */} 
                    <div> 
                       <label htmlFor="initial_balance" className={labelBaseStyle}>초기 자본 (KRW)</label>
                       <div className="mt-1 flex items-center space-x-2"> {/* Flex 컨테이너 */} 
                           {/* Input and Buttons Group */} 
                           <div className="flex flex-grow items-center space-x-2"> 
                               <input 
                                  id="initial_balance" 
                                  name="initial_balance" 
                                  type="number" 
                                  value={initialBalance} 
                                  onChange={(e) => setInitialBalance(e.target.value)} 
                                  className={`${inputBaseStyle} flex-grow`} 
                                  min="0" 
                               />
                               <button type="button" onClick={() => adjustInitialBalance(100000)} className={smallButtonStyle}>+10만</button>
                               <button type="button" onClick={() => adjustInitialBalance(500000)} className={smallButtonStyle}>+50만</button>
                               <button type="button" onClick={() => adjustInitialBalance(1000000)} className={smallButtonStyle}>+100만</button>
                               <button type="button" onClick={resetInitialBalance} className={`${smallButtonStyle} bg-gray-300 dark:bg-gray-500`}>초기화</button>
                           </div>
                           {/* Formatted Amount Display */} 
                           <span className="ml-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"> 
                              {/* 현재 금액 표시 (포맷팅 및 오류 처리) */} 
                              {formatCurrency(parseFloat(initialBalance) || 0)}
                           </span>
                       </div>
                    </div>
                    {/* RSI Group */} 
                    <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">RSI</p>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                           <div>
                                <label htmlFor="rsi_period" className={paramLabelStyle}>Period</label>
                                <input id="rsi_period" name="rsi_period" type="number" value={strategyParams.rsi_period} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                        </div>
                    </div>
                    {/* MACD Group */} 
                    <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">MACD</p>
                         <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                            <div>
                                <label htmlFor="macd_fast" className={paramLabelStyle}>Fast</label>
                                <input id="macd_fast" name="macd_fast" type="number" value={strategyParams.macd_fast} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                            <div>
                                <label htmlFor="macd_slow" className={paramLabelStyle}>Slow</label>
                                <input id="macd_slow" name="macd_slow" type="number" value={strategyParams.macd_slow} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                            <div>
                                <label htmlFor="macd_signal" className={paramLabelStyle}>Signal</label>
                                <input id="macd_signal" name="macd_signal" type="number" value={strategyParams.macd_signal} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                        </div>
                    </div>
                    {/* SMA Group */} 
                    <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">SMA</p>
                         <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                           <div>
                                <label htmlFor="sma_period" className={paramLabelStyle}>Period</label>
                                <input id="sma_period" name="sma_period" type="number" value={strategyParams.sma_period} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                        </div>
                    </div>
                    {/* Bollinger Bands Group */} 
                    <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Bollinger Bands</p>
                         <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                           <div>
                                <label htmlFor="bollinger_period" className={paramLabelStyle}>Period</label>
                                <input id="bollinger_period" name="bollinger_period" type="number" value={strategyParams.bollinger_period} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                            <div>
                                <label htmlFor="bollinger_std" className={paramLabelStyle}>Std Dev</label>
                                <input id="bollinger_std" name="bollinger_std" type="number" step="0.1" value={strategyParams.bollinger_std} onChange={handleParamChange} className={paramInputStyle} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 백테스트 시작 버튼 영역 (스타일 복원) */}
            <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={handleBacktest}
                disabled={isLoading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${ 
                  isLoading
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? '처리 중...' : '백테스트 실행'}
              </button>
            </div>
        </div>
      </div>

      {/* 로딩 및 에러 메시지 (스타일 복원) */}
      {isLoading && <p className="text-center my-4 text-gray-600 dark:text-gray-400">처리 중...</p>}
      {error && <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md"><p className="text-sm text-red-700 dark:text-red-300 text-center">에러: {error}</p></div>}

      {/* 결과 표시 영역 (상세화) */}
      {backtestResults && !isLoading && (
        <div className="mt-8 space-y-6">
          {/* 결과 요약 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">백테스트 요약</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">초기 자본</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(backtestResults.initial_balance)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">최종 자본</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(backtestResults.final_balance)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">수익률 (Return Rate)</dt>
                  <dd className={`mt-1 text-lg font-semibold ${backtestResults.return_rate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercentage(backtestResults.return_rate)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">수익금 (Profit/Loss)</dt>
                  <dd className={`mt-1 text-lg font-semibold ${backtestResults.final_balance - backtestResults.initial_balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(backtestResults.final_balance - backtestResults.initial_balance)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">최대 낙폭 (MDD)</dt>
                  <dd className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{formatPercentage(backtestResults.mdd)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">총 거래 횟수</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{backtestResults.trades.length} 회</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Plotly 차트 추가 */} 
          {plotData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                 <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">거래 차트</h2>
                 <Plot
                   data={plotData.data}
                   layout={plotData.layout}
                   useResizeHandler={true}
                   className="w-full h-[400px]" // 너비와 높이 지정
                 />
              </div>
            </div>
          )}

          {/* 거래 내역 테이블 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">거래 내역</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-750">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {backtestResults.trades.map((trade, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.action === 'BUY' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{trade.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{formatCurrency(trade.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(trade.timestamp).toLocaleString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {backtestResults.trades.length === 0 && (
                <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">거래 내역이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
