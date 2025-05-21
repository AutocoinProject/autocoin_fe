// 뉴스 관련 타입 정의

export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  author?: string;
  category: NewsCategory;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isBookmarked?: boolean;
}

export interface NewsListResponse {
  content: News[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

export interface NewsDetail extends News {
  relatedNews?: RelatedNews[];
}

export interface RelatedNews {
  id: number;
  title: string;
  summary: string;
  imageUrl?: string;
  publishedAt: string;
}

export enum NewsCategory {
  BITCOIN = 'BITCOIN',
  ETHEREUM = 'ETHEREUM',
  ALTCOIN = 'ALTCOIN',
  MARKET = 'MARKET',
  REGULATION = 'REGULATION',
  TECHNOLOGY = 'TECHNOLOGY',
  ALL = 'ALL'
}

export interface NewsSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  category?: NewsCategory | string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface BookmarkRequest {
  bookmarked: boolean;
}

export interface BookmarkResponse {
  newsId: number;
  bookmarked: boolean;
  bookmarkCount: number;
  message: string;
}

export interface NewsStats {
  totalNews: number;
  categories: {
    category: NewsCategory;
    count: number;
    latestUpdate: string;
  }[];
  todayAddedCount: number;
  lastUpdated: string;
}

export interface TrendingNews {
  period: string;
  trending: (News & {
    trendingRank: number;
  })[];
}
