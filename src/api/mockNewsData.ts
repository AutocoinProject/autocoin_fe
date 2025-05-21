// 개발 중 임시로 사용할 더미 뉴스 데이터
import { News, NewsListResponse, NewsCategory, NewsStats } from '@/types/news';

// 이미지 에러 시 사용할 대체 이미지
export const getErrorFallbackImage = (category: NewsCategory) => {
  const categoryNumbers = {
    [NewsCategory.BITCOIN]: 1,
    [NewsCategory.ETHEREUM]: 2,
    [NewsCategory.ALTCOIN]: 3,
    [NewsCategory.MARKET]: 4,
    [NewsCategory.REGULATION]: 5,
    [NewsCategory.TECHNOLOGY]: 6,
    [NewsCategory.ALL]: 7
  };
  
  const num = categoryNumbers[category] || 1;
  return `https://picsum.photos/400/300?random=${num}`;
};

// 더미 뉴스 데이터 (Unsplash의 안정적인 이미지 URL 사용)
export const mockNewsData: News[] = [
  {
    id: 1,
    title: '비트코인, 사상 최고치 경신하며 7만 달러 돌파',
    summary: '비트코인이 시장의 긍정적인 기대감 속에서 7만 달러를 처음으로 돌파하며 역사적인 이정표를 세웠습니다.',
    content: '비트코인이 오늘 새벽 시간대에 급등하며 기존 최고치를 경신했습니다...',
    imageUrl: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=400&h=300&fit=crop',
    sourceUrl: 'https://example.com/bitcoin-news',
    sourceName: '크립토뉴스',
    author: '김기자',
    category: NewsCategory.BITCOIN,
    tags: ['비트코인', '가격상승', '최고치'],
    publishedAt: '2025-05-19T09:30:00',
    createdAt: '2025-05-19T09:35:00',
    updatedAt: '2025-05-19T09:35:00',
    viewCount: 1250,
    isBookmarked: false
  },
  {
    id: 2,
    title: 'SEC, 이더리움 ETF 승인... 기관 투자 길 열려',
    summary: '미국 증권거래위원회(SEC)가 여러 이더리움 ETF 신청을 승인하여 기관 투자의 길을 열었습니다.',
    content: 'SEC가 이더리움 ETF를 승인함으로써...',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
    sourceUrl: 'https://example.com/ethereum-etf',
    sourceName: '파이낸셜타임즈',
    author: '이기자',
    category: NewsCategory.ETHEREUM,
    tags: ['이더리움', 'ETF', '규제'],
    publishedAt: '2025-05-18T14:15:00',
    createdAt: '2025-05-18T14:20:00',
    updatedAt: '2025-05-18T14:20:00',
    viewCount: 980,
    isBookmarked: false
  },
  {
    id: 3,
    title: '메이저 은행, 암호화폐 커스터디 서비스 출시',
    summary: '세계 최대 은행 중 하나가 기관 고객을 대상으로 디지털 자산 커스터디 서비스 출시를 발표했습니다.',
    content: '메이저 은행이 커스터디 서비스를 출시함으로써...',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    sourceUrl: 'https://example.com/bank-custody',
    sourceName: '뱅킹데일리',
    author: '박기자',
    category: NewsCategory.MARKET,
    tags: ['은행', '커스터디', '기관투자'],
    publishedAt: '2025-05-17T16:45:00',
    createdAt: '2025-05-17T16:50:00',
    updatedAt: '2025-05-17T16:50:00',
    viewCount: 756,
    isBookmarked: false
  },
  {
    id: 4,
    title: '새로운 레이어2 솔루션, 10만 TPS 달성 주장',
    summary: '새로운 이더리움 레이어2 확장 솔루션이 테스트넷에서 초당 10만 건 이상의 거래 처리 능력을 시연했습니다.',
    content: '이 새로운 레이어2 솔루션은...',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    sourceUrl: 'https://example.com/layer2-scaling',
    sourceName: '테크인사이더',
    author: '최기자',
    category: NewsCategory.TECHNOLOGY,
    tags: ['이더리움', '스케일링', '레이어2'],
    publishedAt: '2025-05-16T11:20:00',
    createdAt: '2025-05-16T11:25:00',
    updatedAt: '2025-05-16T11:25:00',
    viewCount: 623,
    isBookmarked: false
  },
  {
    id: 5,
    title: 'G7 중앙은행, CBDC 상호 운용성 논의',
    summary: 'G7 국가의 중앙은행 대표들이 중앙은행 디지털 화폐의 상호 운용성을 위한 표준을 논의하기 위해 회의를 가졌습니다.',
    content: 'G7 중앙은행들이 CBDC 표준을 논의...',
    imageUrl: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=400&h=300&fit=crop',
    sourceUrl: 'https://example.com/cbdc-interop',
    sourceName: '글로벌이코노믹스',
    author: '정기자',
    category: NewsCategory.REGULATION,
    tags: ['CBDC', '중앙은행', '상호운용성'],
    publishedAt: '2025-05-15T10:00:00',
    createdAt: '2025-05-15T10:05:00',
    updatedAt: '2025-05-15T10:05:00',
    viewCount: 445,
    isBookmarked: false
  },
  {
    id: 6,
    title: 'NFT 시장, 1년간의 침체 후 회복 조짐',
    summary: 'NFT 시장의 거래량이 지난 한 달간 크게 증가하여 장기간의 침체 이후 회복 가능성을 시사하고 있습니다.',
    content: 'NFT 시장이 회복세를 보이며...',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    sourceUrl: 'https://example.com/nft-recovery',
    sourceName: '아트앤테크',
    author: '강기자',
    category: NewsCategory.ALTCOIN,
    tags: ['NFT', '시장회복', '디지털아트'],
    publishedAt: '2025-05-14T13:40:00',
    createdAt: '2025-05-14T13:45:00',
    updatedAt: '2025-05-14T13:45:00',
    viewCount: 389,
    isBookmarked: false
  }
];

// 더미 뉴스 목록 응답
export const createMockNewsResponse = (page: number = 0, size: number = 12): NewsListResponse => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = mockNewsData.slice(startIndex, endIndex);
  
  return {
    content,
    pageable: {
      sort: { sorted: true, unsorted: false, empty: false },
      pageNumber: page,
      pageSize: size,
      offset: startIndex,
      paged: true,
      unpaged: false
    },
    totalElements: mockNewsData.length,
    totalPages: Math.ceil(mockNewsData.length / size),
    last: endIndex >= mockNewsData.length,
    first: page === 0,
    numberOfElements: content.length,
    size: size,
    number: page,
    sort: { sorted: true, unsorted: false, empty: false },
    empty: content.length === 0
  };
};

// 더미 통계 데이터
export const mockNewsStats: NewsStats = {
  totalNews: 1256,
  categories: [
    {
      category: NewsCategory.BITCOIN,
      count: 425,
      latestUpdate: '2025-05-19T11:30:00'
    },
    {
      category: NewsCategory.ETHEREUM,
      count: 312,
      latestUpdate: '2025-05-19T10:45:00'
    },
    {
      category: NewsCategory.ALTCOIN,
      count: 289,
      latestUpdate: '2025-05-19T11:15:00'
    },
    {
      category: NewsCategory.MARKET,
      count: 156,
      latestUpdate: '2025-05-19T09:20:00'
    },
    {
      category: NewsCategory.REGULATION,
      count: 45,
      latestUpdate: '2025-05-18T16:30:00'
    },
    {
      category: NewsCategory.TECHNOLOGY,
      count: 29,
      latestUpdate: '2025-05-18T14:10:00'
    }
  ],
  todayAddedCount: 12,
  lastUpdated: '2025-05-19T11:30:00'
};
