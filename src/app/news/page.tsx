'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from './components/NewsCard';
import { fetchNewsList, fetchNewsStats } from '@/api/news';
import { News, NewsListResponse, NewsCategory, NewsStats } from '@/types/news';
import { useAuth } from '@/contexts/AuthContext';

type SortOption = 'publishedAt,desc' | 'publishedAt,asc' | 'viewCount,desc' | 'title,asc';

export default function NewsPage() {
  const { isAuthenticated } = useAuth();
  const [newsData, setNewsData] = useState<NewsListResponse | null>(null);
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // 필터 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.ALL);
  const [sortBy, setSortBy] = useState<SortOption>('publishedAt,desc');
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // 뉴스 데이터 불러오기
  const loadNews = useCallback(async (page: number = 0, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const params = {
        page,
        size: 12,
        sort: sortBy,
        category: category,
        keyword: keyword || undefined
      };
      
      const response = await fetchNewsList(params);
      
      if (reset) {
        setNewsData(response);
      } else {
        // 더 많은 뉴스 로드 시 기존 데이터에 추가
        setNewsData(prev => {
          if (!prev) return response;
          return {
            ...response,
            content: [...prev.content, ...response.content]
          };
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('뉴스 데이터 로드 실패:', err);
      setError('뉴스를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, sortBy, keyword]);
  
  // 통계 데이터 불러오기
  const loadStats = useCallback(async () => {
    try {
      const statsData = await fetchNewsStats();
      setStats(statsData);
    } catch (err) {
      console.error('통계 데이터 로드 실패:', err);
      // 통계 데이터 로드 실패는 전체 페이지를 막지 않음
      // 그냥 로그만 남기고 계속 진행
    }
  }, []);
  
  // 초기 데이터 로드
  useEffect(() => {
    loadNews(0, true);
    loadStats();
  }, [loadNews, loadStats]);
  
  // 필터 변경 시 리셋
  useEffect(() => {
    setCurrentPage(0);
    loadNews(0, true);
  }, [category, sortBy, keyword]);
  
  // 검색 처리
  const handleSearch = () => {
    setKeyword(searchInput.trim());
  };
  
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 범주 변경
  const handleCategoryChange = (newCategory: NewsCategory) => {
    setCategory(newCategory);
  };
  
  // 더 많이 로드
  const handleLoadMore = () => {
    if (newsData && !newsData.last) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadNews(nextPage, false);
    }
  };
  
  // 북마크 변경 처리
  const handleBookmarkChange = (newsId: number, isBookmarked: boolean) => {
    setNewsData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map(news => 
          news.id === newsId ? { ...news, isBookmarked } : news
        )
      };
    });
  };
  
  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">뉴스를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 오류 상태
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => loadNews(0, true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 데이터가 없는 경우
  if (!newsData || newsData.content.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">암호화폐 뉴스</h1>
        
        {/* 필터 UI 생략 */}
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📰</div>
            <p className="text-gray-600 dark:text-gray-400">뉴스가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const featuredNews = newsData.content[0];
  const regularNews = newsData.content.slice(1);
  
  const getCategoryLabel = (cat: NewsCategory) => {
    switch (cat) {
      case NewsCategory.ALL: return '전체';
      case NewsCategory.BITCOIN: return '비트코인';
      case NewsCategory.ETHEREUM: return '이더리움';
      case NewsCategory.ALTCOIN: return '알트코인';
      case NewsCategory.MARKET: return '시장';
      case NewsCategory.REGULATION: return '규제';
      case NewsCategory.TECHNOLOGY: return '기술';
      default: return cat;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">암호화폐 뉴스</h1>
        {stats && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 {stats.totalNews.toLocaleString()}개 뉴스 • 오늘 {stats.todayAddedCount}개 추가
          </div>
        )}
      </div>
      
      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="뉴스 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as NewsCategory)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(NewsCategory).map(cat => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="publishedAt,desc">최신 순</option>
            <option value="publishedAt,asc">오래된 순</option>
            <option value="viewCount,desc">조회수 순</option>
            <option value="title,asc">제목 순</option>
          </select>
        </div>
      </div>
      
      {/* 카테고리 통계 */}
      {stats && (
        <div className="flex flex-wrap gap-2">
          {stats.categories
            .filter(cat => cat.count > 0)
            .map(cat => (
              <button 
                key={cat.category}
                onClick={() => handleCategoryChange(cat.category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  category === cat.category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {getCategoryLabel(cat.category)} ({cat.count})
              </button>
            ))
          }
        </div>
      )}
      
      {/* 대형 뉴스 (처음 기사) */}
      {featuredNews && (
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => window.location.href = `/news/${featuredNews.id}`}
        >
          <div className="h-80 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            {featuredNews.imageUrl ? (
              <img 
                src={featuredNews.imageUrl} 
                alt={featuredNews.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 ${
              featuredNews.imageUrl ? 'hidden' : ''
            }`}>
              <div className="text-center">
                <div className="text-8xl opacity-30">📰</div>
                <div className="text-lg mt-4">대형 뉴스 이미지</div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  대형 뉴스
                </span>
                {featuredNews.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/20 text-white rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 hover:text-blue-200 transition-colors">{featuredNews.title}</h2>
              <p className="text-white/90 text-base mb-3 line-clamp-2">{featuredNews.summary}</p>
              <div className="flex justify-between items-center">
                <div className="text-white/80 text-sm">
                  <span className="font-medium">{featuredNews.sourceName}</span>
                  {featuredNews.author && <span> • {featuredNews.author}</span>}
                </div>
                <div className="text-white/80 text-sm">
                  <span>👁 {featuredNews.viewCount.toLocaleString()}</span>
                  <span className="ml-3">{new Date(featuredNews.publishedAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 뉴스 그리드 */}
      {regularNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map(news => (
            <NewsCard 
              key={news.id} 
              news={news} 
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </div>
      )}
      
      {/* 더 불러오기 버튼 */}
      {newsData && !newsData.last && (
        <div className="flex justify-center">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                로딩 중...
              </>
            ) : (
              '더 많은 뉴스 보기'
            )}
          </button>
        </div>
      )}
      
      {/* 뉴스레터 구독 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">암호화폐 뉴스 알림 받기</h3>
            <p className="text-gray-600 dark:text-gray-400">바로 확인하세요! 일일 암호화폐 뉴스와 시장 분석을 드립니다.</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="이메일 주소"
              className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 border-0 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              구독
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
