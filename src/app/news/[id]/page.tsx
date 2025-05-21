'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchNewsDetail, toggleNewsBookmark } from '@/api/news';
import { getErrorFallbackImage } from '@/api/mockNewsData';
import { NewsDetail } from '@/types/news';
import { useAuth } from '@/contexts/AuthContext';

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

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);

  // 이미지 에러 처리
  const handleImageError = () => {
    if (!imageError && news) {
      setImageError(true);
      const fallbackUrl = getErrorFallbackImage(news.category);
      setCurrentImageUrl(fallbackUrl);
    } else {
      setCurrentImageUrl(undefined);
    }
  };

  // 뉴스 상세 정보 로드
  useEffect(() => {
    const loadNewsDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const newsDetail = await fetchNewsDetail(Number(id));
        setNews(newsDetail);
        setIsBookmarked(newsDetail.isBookmarked || false);
        setCurrentImageUrl(newsDetail.imageUrl);
        setImageError(false);
        setError(null);
      } catch (err) {
        console.error('뉴스 상세 정보 로드 실패:', err);
        setError('뉴스를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadNewsDetail();
  }, [id]);

  // 북마크 토글
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!news) return;

    setIsBookmarking(true);
    try {
      const newBookmarkState = !isBookmarked;
      await toggleNewsBookmark(news.id, newBookmarkState);
      setIsBookmarked(newBookmarkState);
    } catch (error) {
      console.error('북마크 처리 실패:', error);
      alert('북마크 처리에 실패했습니다.');
    } finally {
      setIsBookmarking(false);
    }
  };

  // 원본 기사로 이동
  const handleGoToOriginal = () => {
    if (news?.sourceUrl) {
      window.open(news.sourceUrl, '_blank');
    }
  };

  // 뒤로 가기
  const handleBack = () => {
    router.back();
  };

  // 공유하기
  const handleShare = async () => {
    if (!news) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('공유 취소됨');
      }
    } else {
      // 폴백: URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">뉴스를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || '뉴스를 찾을 수 없습니다.'}
            </p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(news.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로 가기 버튼 */}
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        뉴스 목록으로 돌아가기
      </button>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* 헤더 정보 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(news.category)}`}>
                {getCategoryLabel(news.category)}
              </span>
              {news.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBookmarkToggle}
                disabled={isBookmarking}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isBookmarked
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-yellow-100'
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
              
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                title="공유하기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {news.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {news.summary}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">{news.sourceName}</span>
              {news.author && (
                <>
                  <span>•</span>
                  <span>{news.author}</span>
                </>
              )}
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>👁 {news.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 메인 이미지 */}
        {currentImageUrl && (
          <div className="relative h-64 sm:h-96 bg-gray-200 dark:bg-gray-700">
            <img
              src={currentImageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
        )}
        
        {!currentImageUrl && (
          <div className="relative h-64 sm:h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-8xl opacity-30 mb-4">📰</div>
              <div className="text-lg">이미지를 불러올 수 없습니다</div>
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="p-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {news.content}
            </div>
          </div>

          {/* 원본 기사 링크 */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGoToOriginal}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              원본 기사 보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        {/* 관련 뉴스 */}
        {news.relatedNews && news.relatedNews.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              관련 뉴스
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {news.relatedNews.map(relatedNews => (
                <div 
                  key={relatedNews.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/news/${relatedNews.id}`)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {relatedNews.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {relatedNews.summary}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(relatedNews.publishedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
