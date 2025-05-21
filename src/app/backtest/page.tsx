"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Select, { MultiValue } from 'react-select';

// Plotly 컴포넌트 동적 로딩
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// --- 타입 정의 ---

type Exchange = 'upbit' | 'binance'; // 거래소 타입 추가 (필요시 확장)
type Interval = 'minute1' | 'minute3' | 'minute5' | 'minute10' | 'minute15' | 'minute30' | 'hour1' | 'hour4' | 'day' | 'week' | 'month';

// 전략 선택 옵션 타입
interface StrategyOption {
  value: string;
  label: string;
  params: string[]; // 해당 전략의 파라미터 이름 목록
}

// 각 전략별 파라미터 타입 (입력 관리용)
interface StrategyParams extends Record<string, unknown> {
  RSI?: { length?: number | string };
  MACD?: { fast_period?: number | string; slow_period?: number | string; signal_period?: number | string };
  SMA?: { length?: number | string };
  BollingerBands?: { length?: number | string; std?: number | string };
  Stochastic?: { k_period?: number | string; d_period?: number | string; smooth?: number | string };
  ATR?: { length?: number | string };
  OBV?: {}; // OBV는 파라미터 없음
}

// 백엔드 요청 시 strategies 배열 내 객체 타입
interface StrategyRequest {
  name: string;
  params: Record<string, number>; // 전송 시 숫자로 변환
}

// 백엔드 요청 본문 타입 (새 구조)
interface BacktestRequestBody {
  exchange: Exchange;
  symbol: string;
  interval: Interval;
  starting_balance: number;
  strategies: StrategyRequest[];
  api_key: string; // 루트 레벨로 변경
  secret_key: string; // 루트 레벨로 변경
}

// 개별 거래 내역 타입 (새로 추가 및 수정)
interface Trade {
  timestamp: string;
  action: 'BUY' | 'SELL';
  price: number;          // 코인 1개당 가격
  amount: number;           // 거래 수량
  total_invested?: number;  // 매수 시 총 투자 금액 (선택적)
  total_received?: number;  // 매도 시 총 회수 금액 (선택적)
  balance_after: number;    // 거래 후 잔액
}

// Equity Curve Point 타입 정의 (새로 추가)
interface EquityPoint {
  balance: number;
  timestamp: string; // 날짜 문자열 (YYYY-MM-DD 형식으로 추정)
}

// 백엔드 응답 데이터 상세 타입 정의 (새 구조 반영)
interface BacktestResultData {
  starting_balance: number; // 이름 변경
  ending_balance: number; // 이름 변경
  total_return_pct: number; // 이름 변경
  max_drawdown_pct: number; // 이름 변경
  number_of_trades: number; // 새 필드
  equity_curve: EquityPoint[]; // 새 필드 (trades 대체)
  trades: Trade[]; // trades 필드 추가
}

// 백엔드 응답 타입
interface BacktestTestRunResponse {
  success: boolean;
  message?: string;
  data?: BacktestResultData;
}

// Plotly 데이터 타입
interface PlotlyData {
  data: unknown[];
  layout: Record<string, unknown>;
}

// 사용 가능한 전략 목록 및 파라미터 정의
const availableStrategies: StrategyOption[] = [
  { value: 'RSI', label: 'RSI', params: ['length'] },
  { value: 'MACD', label: 'MACD', params: ['fast_period', 'slow_period', 'signal_period'] },
  { value: 'SMA', label: 'SMA', params: ['length'] },
  { value: 'BollingerBands', label: 'Bollinger Bands', params: ['length', 'std'] },
  { value: 'Stochastic', label: 'Stochastic', params: ['k_period', 'd_period', 'smooth'] },
  { value: 'ATR', label: 'ATR', params: ['length'] },
  { value: 'OBV', label: 'OBV', params: [] },
];

// 전략별 파라미터 기본값
const defaultStrategyParams: StrategyParams = {
  RSI: { length: 14 },
  MACD: { fast_period: 12, slow_period: 26, signal_period: 9 },
  SMA: { length: 20 },
  BollingerBands: { length: 20, std: 2.0 },
  Stochastic: { k_period: 14, d_period: 3, smooth: 3 },
  ATR: { length: 14 },
  OBV: {},
};

// 파라미터 설명 데이터 수정 (사용자 관점)
const paramDescriptions: Record<string, Record<string, string>> = {
  RSI: {
    length: '기간. 짧을수록 민감하게 반응하여 매매 신호가 잦아짐 (기본 14)',
  },
  MACD: {
    fast_period: '단기 이동평균 기간. 짧을수록 최근 가격 변화에 민감 (기본 12)',
    slow_period: '장기 이동평균 기간. 길수록 장기 추세를 반영 (기본 26)',
    signal_period: '시그널 라인 기간. MACD선의 이동평균으로, 매매 타이밍 결정에 영향 (기본 9)',
  },
  SMA: {
    length: '이동평균 계산 기간. 짧을수록 단기, 길수록 장기 추세 반영',
  },
  BollingerBands: {
    length: '중심 이동평균 및 표준편차 계산 기간 (기본 20)',
    std: '표준편차 배수. 작을수록 밴드 폭이 좁아져 신호가 잦을 수 있음 (기본 2)',
  },
  Stochastic: {
    k_period: '%K 계산 기간. 짧을수록 민감하게 반응 (기본 14)',
    d_period: '%D(시그널) 계산 기간. %K의 이동평균으로, %K보다 느리게 움직임 (기본 3)',
    smooth: '%K 스무딩 기간. 클수록 %K선이 부드러워짐 (기본 3)',
  },
  ATR: {
    length: '평균 변동성 계산 기간. 짧을수록 최근 변동성에 민감 (기본 14)',
  },
};

// 추천 파라미터 데이터 (표 기반)
const recommendedParamsData = [
  { name: 'RSI', params: 'length = 14', description: '14일 기준 (가장 대중적)' },
  { name: 'SMA', params: 'length = 20', description: '20일 이동평균 (단기 추세), 50/100/200도 사용' },
  { name: 'EMA', params: 'length = 12, length = 26', description: '빠른 반응형 평균선 (MACD에도 사용)' },
  { name: 'MACD', params: 'fast = 12, slow = 26, signal = 9', description: '기본값' },
  { name: 'Bollinger Bands', params: 'length = 20, std = 2', description: '20일 평균, ±2 표준편차' },
  { name: 'Stochastic', params: '%K = 14, %D = 3, smooth = 3', description: '표준 설정' },
  { name: 'ATR', params: 'length = 14', description: '14일 변동성 측정 기본값' },
  { name: 'OBV', params: '없음', description: '가격+거래량 누적합' },
];

// 심볼 옵션 데이터 추가
const symbolOptions = [
  { value: 'BTC/KRW', label: '비트코인 (BTC/KRW)' },
  { value: 'ETH/KRW', label: '이더리움 (ETH/KRW)' },
  { value: 'XRP/KRW', label: '리플 (XRP/KRW)' },
  { value: 'ADA/KRW', label: '에이다 (ADA/KRW)' }, 
  { value: 'SOL/KRW', label: '솔라나 (SOL/KRW)' },
  { value: 'DOGE/KRW', label: '도지코인 (DOGE/KRW)' },
  { value: 'DOT/KRW', label: '폴카닷 (DOT/KRW)' },
  { value: 'BNB/KRW', label: '바이낸스 코인 (BNB/KRW)' },
  { value: 'LINK/KRW', label: '체인링크 (LINK/KRW)' },
  { value: 'XLM/KRW', label: '스텔라루멘 (XLM/KRW)' },
  { value: 'LTC/KRW', label: '라이트코인 (LTC/KRW)' },
  { value: 'EOS/KRW', label: '이오스 (EOS/KRW)' },
  { value: 'TRX/KRW', label: '트론 (TRX/KRW)' },
  { value: 'BCH/KRW', label: '비트코인 캐시 (BCH/KRW)' },
  { value: 'SAND/KRW', label: '샌드박스 (SAND/KRW)' },
  { value: 'SXP/KRW', label: '스와이프 (SXP/KRW)' },
  { value: 'MED/KRW', label: '메디블록 (MED/KRW)' },
  { value: 'VET/KRW', label: '비체인 (VET/KRW)' },
  { value: 'IOTA/KRW', label: '아이오타 (IOTA/KRW)' },
];

// --- 컴포넌트 ---
export default function BacktestPage() {
  // --- 상태 변수 ---
  const [selectedExchange, setSelectedExchange] = useState<Exchange>('upbit');
  const [symbol, setSymbol] = useState<string>(symbolOptions[0].value);
  const [interval, setInterval] = useState<Interval>('day');
  const [startingBalance, setStartingBalance] = useState<string>('1000000'); // initialBalance -> startingBalance
  const [selectedStrategies, setSelectedStrategies] = useState<MultiValue<StrategyOption>>(availableStrategies);
  const [strategyParams, setStrategyParams] = useState<StrategyParams>(defaultStrategyParams);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResultData | null>(null);
  const [plotData, setPlotData] = useState<PlotlyData | null>(null);
  // state 변수 제거 - 사용되지 않음

  // --- 로컬 스토리지 연동 (API 키 관련 로직 제거) ---
  // useEffect(() => { ... }, []); // API 키 로딩 로직 제거

  // --- 초기 자본 조절 핸들러 ---
  const adjustStartingBalance = (amount: number) => {
    setStartingBalance(prev => {
        const currentNum = parseFloat(prev);
        const newValue = isNaN(currentNum) ? amount : currentNum + amount;
        return Math.max(0, newValue).toString();
    });
  };

  const resetStartingBalance = () => {
      setStartingBalance('1000000');
  };

  // --- 차트 데이터 준비 함수 (Equity Curve 용으로 수정) ---
  const preparePlotData = (results: BacktestResultData): PlotlyData | null => {
    // equity_curve 데이터 확인
    if (!results || !results.equity_curve || results.equity_curve.length === 0) {
      return null;
    }

    // equity_curve 데이터를 시간 순서대로 정렬 (필요시)
    const sortedEquityCurve = [...results.equity_curve].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const equityTrace = {
      x: sortedEquityCurve.map(point => new Date(point.timestamp)), // 타임스탬프를 Date 객체로 변환
      y: sortedEquityCurve.map(point => point.balance), // 자산 금액
      mode: 'lines', // 라인 차트로 변경
      type: 'scatter',
      name: '자산 변화',
      line: { color: '#3B82F6' }, // 선 색상 지정 (예: 파란색)
    };

    const layout = {
      title: '자산 변화 곡선 (Equity Curve)', // 차트 제목 변경
      xaxis: { title: '날짜' }, // x축 이름 변경
      yaxis: { title: '자산 (KRW)' }, // y축 이름 변경
      showlegend: true,
      paper_bgcolor: 'rgba(0,0,0,0)', 
      plot_bgcolor: 'rgba(0,0,0,0)', 
      font: { 
        // 다크모드 대응 개선: CSS 변수 사용 시도
        color: 'var(--chart-font-color, #374151)' 
      }, 
    };

    return {
      data: [equityTrace], // equityTrace만 포함
      layout: layout,
    };
  };

  // --- 핸들러 ---

  // 전략 파라미터 입력 변경 핸들러 (구조 변경)
  const handleStrategyParamChange = (
    strategyName: keyof StrategyParams,
    paramName: string,
    value: string
  ) => {
    setStrategyParams(prevParams => ({
      ...prevParams,
      [strategyName]: {
        ...prevParams[strategyName],
        [paramName]: value,
      },
    }));
  };

  // 백테스트 시작 핸들러 (대폭 수정)
  const handleBacktest = async () => {
    setIsLoading(true);
    setError(null);
    setBacktestResults(null);
    setPlotData(null);

    // --- 1. API 키 로드 --- 
    const accessKey = localStorage.getItem(`${selectedExchange}AccessKey`);
    const secretKey = localStorage.getItem(`${selectedExchange}SecretKey`);

    if (!accessKey || !secretKey) {
        alert(`${selectedExchange.toUpperCase()} API 키가 설정되지 않았습니다. 설정 페이지에서 키를 등록해주세요.`);
        setIsLoading(false);
        return;
    }

    // --- 2. 입력값 유효성 검사 ---
    const startingBalanceNum = parseFloat(startingBalance);
    if (isNaN(startingBalanceNum) || startingBalanceNum <= 0) {
        alert('초기 자본(Starting Balance)은 0보다 큰 숫자여야 합니다.');
        setIsLoading(false);
        return;
    }
    if (selectedStrategies.length === 0) {
        alert('하나 이상의 전략을 선택해주세요.');
        setIsLoading(false);
        return;
    }
    // TODO: symbol, interval 형식 검증 추가

    // --- 3. 선택된 전략 및 파라미터 처리 ---
    const strategiesRequest: StrategyRequest[] = [];
    let paramError = false;
    for (const selectedOption of selectedStrategies) {
        const strategyName = selectedOption.value as keyof StrategyParams;
        const currentParams = strategyParams[strategyName] || {};
        const numericParams: Record<string, number> = {};

        try {
            for (const paramDef of availableStrategies.find(s => s.value === strategyName)?.params || []) {
                const value = currentParams[paramDef as keyof typeof currentParams];
                if (value === undefined || value === null || value === '') {
                    throw new Error(`전략 '${strategyName}'의 파라미터 '${paramDef}' 값이 비어있습니다.`);
                }
                const parsedValue = parseFloat(value as string);
                if (isNaN(parsedValue)) {
                    throw new Error(`전략 '${strategyName}'의 파라미터 '${paramDef}' 값이 유효한 숫자가 아닙니다: ${value}`);
                }
                numericParams[paramDef] = parsedValue;
            }
            strategiesRequest.push({ name: strategyName, params: numericParams });
        } catch (parseError: any) {
            alert(parseError.message);
            paramError = true;
            break; // 오류 발생 시 중단
        }
    }

    if (paramError) {
        setIsLoading(false);
        return;
    }

    // --- 4. 백엔드 API 요청 본문 구성 (새 구조) ---
    const requestBody: BacktestRequestBody = {
      exchange: selectedExchange,
      symbol: symbol, 
      interval: interval,
      starting_balance: startingBalanceNum,
      strategies: strategiesRequest,
      api_key: accessKey,
      secret_key: secretKey,
    };

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/backtest/test_run`;

    console.log(`Requesting Backend API: ${apiUrl}`);
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    // --- 5. API 호출 및 결과 처리 --- 
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

      if (responseData.success && responseData.data) {
        setBacktestResults(responseData.data);
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
    // Check if the value is a valid number
    if (typeof value !== 'number' || isNaN(value)) {
      return '-'; // Return a placeholder if not valid
    }
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
  };

  const formatPercentage = (value: number) => {
    // Check if the value is a valid number before calling toFixed
    if (typeof value !== 'number' || isNaN(value)) {
      return '-'; // Return a placeholder if not valid
    }
    return `${value.toFixed(2)}%`;
  };

  // --- 공통 입력 스타일 ---
  const inputBaseStyle = "block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 sm:text-sm";
  const labelBaseStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const paramLabelStyle = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";
  const paramInputStyle = `block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 sm:text-xs`;
  const smallButtonStyle = "px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors";
  // react-select 스타일 수정 (메뉴/옵션 배경 제거)
  const selectStyles = {
    control: (base: Record<string, unknown>) => ({ ...base, backgroundColor: 'var(--select-bg)', borderColor: 'var(--select-border)' }),
    menu: (base: Record<string, unknown>) => ({ 
      ...base, 
      zIndex: 9999 
    }),
    menuPortal: (base: Record<string, unknown>) => ({ 
      ...base, 
      zIndex: 9999 
    }),
    option: (base: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean; }) => ({
      ...base,
    }),
    multiValue: (base: Record<string, unknown>) => ({ ...base, backgroundColor: 'var(--select-multivalue-bg)' }),
    multiValueLabel: (base: Record<string, unknown>) => ({ ...base, color: 'var(--select-multivalue-label-color)' }),
    multiValueRemove: (base: Record<string, unknown>) => ({ ...base, color: 'var(--select-multivalue-remove-color)', ':hover': { backgroundColor: 'var(--select-multivalue-remove-hover-bg)', color: 'var(--select-multivalue-remove-hover-color)' } }),
    input: (base: Record<string, unknown>) => ({ ...base, color: 'var(--select-input-color)' }),
    singleValue: (base: Record<string, unknown>) => ({ ...base, color: 'var(--select-singlevalue-color)' }),
  };

  // --- JSX ---
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">백테스트 요청</h1>

      {/* 메인 컨텐츠 그리드 (폼 + 추천 파라미터) 재구성 */} 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6"> 
        
        {/* 왼쪽 컬럼: 설정 폼 카드 */} 
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">입력 파라미터</h2>
                
                {/* 기본 설정 (거래소, 심볼, 주기, 초기자본) */} 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    {/* 거래소 */} 
                    <div>
                        <label htmlFor="exchangeSelect" className={labelBaseStyle}>거래소</label>
                        <select 
                           id="exchangeSelect" 
                           value={selectedExchange} 
                           onChange={(e) => setSelectedExchange(e.target.value as Exchange)} 
                           className={inputBaseStyle}
                        >
                           <option value="upbit">Upbit</option>
                           <option value="binance">Binance</option>
                        </select>
                    </div>
                    {/* 심볼 (Select로 변경) */} 
                    <div>
                        <label htmlFor="symbolSelect" className={labelBaseStyle}>심볼</label>
                        <select 
                           id="symbolSelect" 
                           value={symbol} 
                           onChange={(e) => setSymbol(e.target.value)} 
                           className={inputBaseStyle}
                        >
                           {symbolOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                 {option.label}
                              </option>
                           ))}
                        </select>
                    </div>
                    {/* 주기 */} 
                    <div>
                        <label htmlFor="intervalSelect" className={labelBaseStyle}>실행 주기</label>
                        <select 
                           id="intervalSelect" 
                           value={interval} 
                           onChange={(e) => setInterval(e.target.value as Interval)} 
                           className={inputBaseStyle}
                        >
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
                    {/* 초기 자본 */} 
                    <div className="md:col-span-1"> 
                       <label htmlFor="starting_balance" className={labelBaseStyle}>초기 자본 (KRW)</label>
                       <div className="mt-1 flex flex-wrap items-center gap-2"> 
                           <input 
                              id="starting_balance" 
                              name="starting_balance" 
                              type="number" 
                              value={startingBalance} 
                              onChange={(e) => setStartingBalance(e.target.value)} 
                              className={`${inputBaseStyle} min-w-[120px] flex-grow`} 
                              min="0" 
                           />
                           <div className="flex items-center space-x-1 flex-shrink-0"> 
                               <button type="button" onClick={() => adjustStartingBalance(100000)} className={smallButtonStyle}>+10만</button>
                               <button type="button" onClick={() => adjustStartingBalance(500000)} className={smallButtonStyle}>+50만</button>
                               <button type="button" onClick={() => adjustStartingBalance(1000000)} className={smallButtonStyle}>+100만</button>
                               <button type="button" onClick={resetStartingBalance} className={`${smallButtonStyle} bg-gray-300 dark:bg-gray-500`}>초기화</button>
                           </div>
                           <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"> 
                              {formatCurrency(parseFloat(startingBalance) || 0)}
                           </span>
                       </div>
                    </div>
                </div>

                {/* 전략 선택 및 파라미터 입력 */} 
                <div className="mb-6">
                    <div className="mb-4">
                        <label htmlFor="strategySelect" className={labelBaseStyle}>전략 선택 (다중 선택 가능)</label>
                        <Select
                            id="strategySelect"
                            isMulti
                            options={availableStrategies}
                            value={selectedStrategies}
                            onChange={setSelectedStrategies}
                            className="basic-multi-select" 
                            classNamePrefix="select"
                            styles={selectStyles}
                            placeholder="사용할 전략을 선택하세요..."
                        />
                    </div>
                    
                    {/* 동적 파라미터 입력 폼 (다시 selectedStrategies 기준으로 변경) */} 
                    {selectedStrategies.length > 0 && ( // 조건부 렌더링 복원
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">선택된 전략 파라미터 설정</h3>
                            <div className="space-y-4">
                                {/* selectedStrategies를 기준으로 루프 복원 */} 
                                {selectedStrategies.map((option) => { 
                                    const strategyInfo = availableStrategies.find(s => s.value === option.value);
                                    if (!strategyInfo || !strategyInfo.params || strategyInfo.params.length === 0) return null;
                                    
                                    const strategyName = strategyInfo.value as keyof StrategyParams;
                                    const currentStrategyParams = strategyParams[strategyName] || {};

                                    return (
                                        <div key={strategyInfo.value} className="p-3 border rounded border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-750">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{strategyInfo.label} 파라미터</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4">
                                                {strategyInfo.params.map(paramName => (
                                                    <div key={paramName}>
                                                        <label htmlFor={`${strategyInfo.value}-${paramName}`} className={paramLabelStyle}>{paramName}</label>
                                                        <input
                                                            id={`${strategyInfo.value}-${paramName}`}
                                                            name={paramName}
                                                            type="number"
                                                            step="any" 
                                                            value={currentStrategyParams[paramName as keyof typeof currentStrategyParams] ?? defaultStrategyParams[strategyName]?.[paramName as keyof typeof currentStrategyParams] ?? ''} 
                                                            onChange={(e) => handleStrategyParamChange(strategyName, paramName, e.target.value)}
                                                            className={paramInputStyle}
                                                        />
                                                        {/* 파라미터 설명 추가 */} 
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                           {paramDescriptions[strategyName]?.[paramName] ?? ''}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div> 
                        </div>
                    )} { /* 조건부 렌더링 닫기 복원 */ } 
                </div> { /* 전략 선택 및 파라미터 입력 div 끝 */ } 
                
                {/* 백테스트 시작 버튼 */} 
                <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={handleBacktest}
                    disabled={isLoading || selectedStrategies.length === 0}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${ 
                      isLoading || selectedStrategies.length === 0 
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? '처리 중...' : '백테스트 실행'}
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼: 추천 파라미터 값 */} 
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg shadow p-4 sm:p-6 h-full"> {/* 높이 채움 추가 */} 
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">추천 파라미터 값</h3>
            <dl className="space-y-4">
              {recommendedParamsData.map((item) => (
                <div key={item.name} className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-b-0">
                  <dt className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.name}</dt>
                  <dd className="mt-1 text-xs text-gray-600 dark:text-gray-400"><span className="font-medium">파라미터:</span> {item.params}</dd>
                  <dd className="mt-0.5 text-xs text-gray-500 dark:text-gray-500"><span className="font-medium">설명:</span> {item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

      </div> {/* 메인 컨텐츠 그리드 끝 */} 

      {/* 로딩, 에러, 결과 표시 영역 */} 
      {isLoading && <p className="text-center my-4 text-gray-600 dark:text-gray-400">처리 중...</p>}
      {error && <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md"><p className="text-sm text-red-700 dark:text-red-300 text-center">에러: {error}</p></div>}

      {backtestResults && !isLoading && (
        <div className="mt-8 space-y-6">
          {/* 결과 요약 카드 (필드 이름 변경) */} 
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">백테스트 요약</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">초기 자본</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(backtestResults.starting_balance)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">최종 자본</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(backtestResults.ending_balance)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">수익률 (Return Rate)</dt>
                  <dd className={`mt-1 text-lg font-semibold ${backtestResults.total_return_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercentage(backtestResults.total_return_pct)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">수익금 (Profit/Loss)</dt>
                  <dd className={`mt-1 text-lg font-semibold ${backtestResults.ending_balance - backtestResults.starting_balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(backtestResults.ending_balance - backtestResults.starting_balance)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">최대 낙폭 (MDD)</dt>
                  <dd className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{formatPercentage(backtestResults.max_drawdown_pct)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">총 거래 횟수</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{backtestResults.number_of_trades ?? 0} 회</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Plotly 차트 (Equity Curve 표시) */} 
          {plotData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                 <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">자산 변화 곡선</h2>
                 <Plot
                   data={plotData.data}
                   layout={plotData.layout}
                   useResizeHandler={true}
                   className="w-full h-[400px]" 
                 />
              </div>
            </div>
          )}

          {/* 거래 내역 테이블 추가 */} 
          {backtestResults.trades && backtestResults.trades.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">거래 내역</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">시간</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">유형</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">개당 가격 (KRW)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">수량</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">총 투자/회수 (KRW)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">거래 후 잔액 (KRW)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {backtestResults.trades.map((trade, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{new Date(trade.timestamp).toLocaleString('ko-KR')}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.action === 'BUY' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{trade.action}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(trade.price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{trade.amount.toFixed(8)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(trade.action === 'BUY' ? trade.total_invested ?? 0 : trade.total_received ?? 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(trade.balance_after)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
