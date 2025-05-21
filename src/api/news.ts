import axios, { AxiosResponse } from 'axios';
import config from '@/config/environment';
import { 
  News, 
  NewsListResponse, 
  NewsDetail, 
  NewsSearchParams, 
  BookmarkRequest, 
  BookmarkResponse,
  NewsStats,
  TrendingNews
} from '@/types/news';
import { createMockNewsResponse, mockNewsStats } from './mockNewsData';

const API_BASE_URL = config.apiBaseUrl;

// 개발 환경에서만 더미 데이터 사용
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_NEWS === 'true';

// 토큰 헤더 생성
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 뉴스 목록 조회
export const fetchNewsList = async (params: NewsSearchParams = {}): Promise<NewsListResponse> => {
  // 개발 중 더미 데이터 사용
  if (USE_MOCK_DATA) {
    // 비동기 대기를 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    return createMockNewsResponse(params.page || 0, params.size || 12);
  }
  
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.category && params.category !== 'ALL') queryParams.append('category', params.category);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/v1/news${queryString ? `?${queryString}` : ''}`;
    
    const response: AxiosResponse<NewsListResponse> = await axios.get(url, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    // 500 에러 또는 네트워크 오류 시 더미 데이터로 대체
    if (axios.isAxiosError(error)) {
      // 더미 데이터 반환
      return createMockNewsResponse(params.page || 0, params.size || 12);
    }
    
    throw error;
  }
};

// 뉴스 상세 조회
export const fetchNewsDetail = async (newsId: number): Promise<NewsDetail> => {
  // 개발 중 더미 데이터 사용
  if (USE_MOCK_DATA) {
    console.log('뉴스 상세 더미 데이터를 사용합니다');
    // 비동기 대기를 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 더미 데이터에서 해당 ID의 뉴스 찾기
    const { mockNewsData } = await import('./mockNewsData');
    const baseNews = mockNewsData.find(news => news.id === newsId);
    
    if (!baseNews) {
      throw new Error('뉴스를 찾을 수 없습니다.');
    }
    
    // 더미 전체 콘텐츠 추가
    const mockDetail: NewsDetail = {
      ...baseNews,
      content: `${baseNews.content}\n\n이 뉴스는 최근 암호화폐 시장의 주요 동향을 다루고 있습니다. 시장 전문가들은 이번 이벤트가 전체 암호화폐 생태계에 미칠 영향에 대해 다양한 추측을 내놓고 있습니다.\n\n특히 기관 투자자들의 관심 증가와 새로운 규제 프레임워크의 도입이 주요 결정 요인으로 분석되고 있습니다. 이러한 변화는 암호화폐의 주류 채택을 가속화하고, 더 많은 개인과 기업이 디지턴 자산을 투자 포트폴리오에 포함시키는 계기가 될 것으로 예상됩니다.\n\n반면 일부 대형 대중매체는 여전히 주의 깊은 시각을 르고 있으며, 전반적인 금융 안정성에 미칠 영향에 대해 강조하고 있습니다. 그럼에도 불구하고 대부분의 전문가들은 이번 사건이 아직 특정 세그먼트에 국한되어 있으며, 전체 금융 시장에 직접적인 리스크는 제한적이라고 평가하고 있습니다.`,
      relatedNews: [
        {
          id: newsId + 1,
          title: '약소 박둬 전망과 시장 반응',
          summary: '이번 주요 이벤트 이후 약소 박둬 전망이 업계에 미치는 영향을 분석합니다.',
          imageUrl: undefined,
          publishedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: newsId + 2,
          title: '기술적 분석: 현재 상황에서의 전망',
          summary: '기술적 분석가들이 보는 현재 시점에서의 향후 전망과 예상 시나리오를 제시합니다.',
          imageUrl: undefined,
          publishedAt: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    };
    
    return mockDetail;
  }
  
  try {
    const response: AxiosResponse<NewsDetail> = await axios.get(
      `${API_BASE_URL}/api/v1/news/${newsId}`,
      {
        headers: getAuthHeaders(),
        timeout: 10000
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch news detail:', error);
    
    // 에러 시 또한 더미 데이터로 대체
    if (axios.isAxiosError(error)) {
      console.warn('뉴스 상세 API 오류로 더미 데이터를 사용합니다:', error.response?.status);
      // 재귀 호출로 더미 데이터 반환
      const originalUseMock = USE_MOCK_DATA;
      // 임시로 USE_MOCK_DATA를 true로 만들어 재귀 호출
      return fetchNewsDetail(newsId);
    }
    
    throw error;
  }
};

// 뉴스 북마크 추가/제거
export const toggleNewsBookmark = async (newsId: number, bookmarked: boolean): Promise<BookmarkResponse> => {
  try {
    const response: AxiosResponse<BookmarkResponse> = await axios.post(
      `${API_BASE_URL}/api/v1/news/${newsId}/bookmark`,
      { bookmarked } as BookmarkRequest,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to toggle bookmark:', error);
    throw error;
  }
};

// 내 북마크 뉴스 조회
export const fetchBookmarkedNews = async (params: NewsSearchParams = {}): Promise<NewsListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/v1/news/bookmarks${queryString ? `?${queryString}` : ''}`;
    
    const response: AxiosResponse<NewsListResponse> = await axios.get(url, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookmarked news:', error);
    throw error;
  }
};

// 뉴스 카테고리별 통계
export const fetchNewsStats = async (): Promise<NewsStats> => {
  // 개발 중 더미 데이터 사용
  if (USE_MOCK_DATA) {
    console.log('뉴스 더미 데이터를 사용합니다');
    // 비동기 대기를 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNewsStats;
  }
  
  try {
    const response: AxiosResponse<NewsStats> = await axios.get(
      `${API_BASE_URL}/api/v1/news/stats`,
      { timeout: 10000 }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch news stats:', error);
    
    // 500 에러 또는 기타 에러 시 더미 데이터 반환
    if (axios.isAxiosError(error)) {
      console.warn('통계 API 오류로 더미 데이터를 사용합니다:', error.response?.status);
      return mockNewsStats;
    }
    
    throw error;
  }
};

// 인기 뉴스 조회
export const fetchTrendingNews = async (limit: number = 10, period: string = '7d'): Promise<TrendingNews> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('period', period);
    
    const response: AxiosResponse<TrendingNews> = await axios.get(
      `${API_BASE_URL}/api/v1/news/trending?${queryParams.toString()}`,
      { timeout: 10000 }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending news:', error);
    throw error;
  }
};

// 뉴스 검색 (클라이언트 사이드에서만 사용)
export const searchNews = async (keyword: string, params: NewsSearchParams = {}): Promise<NewsListResponse> => {
  return fetchNewsList({ ...params, keyword });
};
