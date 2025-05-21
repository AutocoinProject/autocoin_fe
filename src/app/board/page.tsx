"use client"; // Add this for useState

import { useState } from 'react'; // Import useState
import Link from 'next/link'; // Import Link
// toast 임포트 제거 - 사용하지 않음
// import { toast } from 'sonner';

// 하드코딩된 카테고리 목록
const CATEGORIES = [
  { id: 1, name: '금융' },
  { id: 2, name: '주식' },
  { id: 3, name: '경제' },
  { id: 4, name: '코인' }
] as const;

export default function BoardPage() {
  const [selectedCategory, setSelectedCategory] = useState<number>(CATEGORIES[0].id); // 기본값을 '금융'으로 설정

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          게시판
        </h1>
        {/* "새 글 작성" 버튼을 Link로 변경 */}
        <Link href="/board/new" passHref>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            새 글 작성
          </button>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-gray-300 dark:border-gray-600">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none
                ${
                  selectedCategory === category.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 게시판 내용 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {CATEGORIES.find(cat => cat.id === selectedCategory)?.name || '전체 게시글'}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          현재 선택된 카테고리는 &apos;{CATEGORIES.find(cat => cat.id === selectedCategory)?.name}&apos; 입니다.
          이곳에 해당 카테고리의 글 목록을 불러와 표시할 예정입니다.
        </p>
      </div>
    </div>
  );
} 