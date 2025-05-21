"use client";

import React from 'react';
import { News } from '@/types/news';
import { toggleNewsBookmark } from '@/api/news';
import { getErrorFallbackImage } from '@/api/mockNewsData';
import { useAuth } from '@/contexts/AuthContext';

interface NewsCardProps {
  news: News;
  onBookmarkChange?: (newsId: number, isBookmarked: boolean) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'BITCOIN':
      return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
    case 'ETHEREUM':
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
    case 'ALTCOIN':
      return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
    case 'MARKET':
      return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    case 'REGULATION':
      return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
    case 'TECHNOLOGY':
      return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'BITCOIN': return '비트코인';
    case 'ETHEREUM': return '이더리움';
    case 'ALTCOIN': return '알트코인';
    case 'MARKET': return '시장';
    case 'REGULATION': return '규제';
    case 'TECHNOLOGY': return '기술';
    default: return category;
  }
};

export default function NewsCard({ news, onBookmarkChange }: NewsCardProps) {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = React.useState(news.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [currentImageUrl, setCurrentImageUrl] = React.useState(news.imageUrl);
  
  // 날짜 포맷팅
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // 이미지 에러 처리
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      // 대체 이미지로 브더 설정
      const fallbackUrl = getErrorFallbackImage(news.category);
      setCurrentImageUrl(fallbackUrl);
    } else {
      // 대체 이미지도 에러가 났으면 이미지 숨기기
      setCurrentImageUrl(undefined);
    }
  };
  
  // 북마크 토글 처리
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    setIsBookmarking(true);
    try {
      const newBookmarkState = !isBookmarked;
      await toggleNewsBookmark(news.id, newBookmarkState);
      setIsBookmarked(newBookmarkState);
      onBookmarkChange?.(news.id, newBookmarkState);
    } catch (error) {
      console.error('북마크 처리 실패:', error);
      alert('북마크 처리에 실패했습니다.');
    } finally {
      setIsBookmarking(false);
    }
  };
  
  // 뉴스 상세 페이지로 이동
  const handleReadMore = () => {
    // Next.js의 라우터를 사용한 내부 페이지 이동
    window.location.href = `/news/${news.id}`;
  };
  
  // 전체 카드 클릭 시 상세 페이지로 이동 (북마크 버튼 제외)
  const handleCardClick = (e: React.MouseEvent) => {
    // 북마크 버튼 클릭 시에는 카드 클릭 이벤트 방지
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handleReadMore();
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt={news.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 ${
          currentImageUrl ? 'hidden' : ''
        }`}>
          <div className="text-center">
            <div className="text-6xl opacity-30">📰</div>
            <div className="text-sm mt-2">뉴스 이미지</div>
          </div>
        </div>
        
        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmarkToggle}
          disabled={isBookmarking}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isBookmarked
              ? 'bg-yellow-500 text-white'
              : 'bg-white/70 hover:bg-white/90 text-gray-600'
          } ${isBookmarking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          title={isBookmarked ? '북마크 제거' : '북마크 추가'}
        >
          {isBookmarking ? (
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
            {getCategoryLabel(news.category)}
          </span>
          {news.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {news.summary}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">{news.sourceName}</span>
            {news.author && (
              <>
                <span>•</span>
                <span>{news.author}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>👁 {news.viewCount.toLocaleString()}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleReadMore}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          자세히 읽기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
