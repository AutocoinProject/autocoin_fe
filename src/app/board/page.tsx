"use client"; // Add this for useState

import { useState } from 'react'; // Import useState

// Define sample categories
const categories = [
  { id: 'finance', name: '금융' },
  { id: 'crypto', name: '코인' },
  { id: 'stocks', name: '주식' },
  { id: 'economy', name: '경제' },
];

export default function BoardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id); // Default to the first category

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          게시판
        </h1>
        {/* 예시: 글쓰기 버튼 - 카테고리 옆이나 다른 곳으로 옮길 수 있습니다. */}
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          새 글 작성
        </button>
      </div>

      {/* Category Tabs/Buttons */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-gray-300 dark:border-gray-600">
          {categories.map((category) => (
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

      {/* 게시판 내용이 여기에 표시됩니다. */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {categories.find(cat => cat.id === selectedCategory)?.name || '전체 게시글'}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {/* 여기에 선택된 카테고리의 게시글 목록이 표시됩니다. */}
          현재 선택된 카테고리는 '{categories.find(cat => cat.id === selectedCategory)?.name}' 입니다.
          이곳에 해당 카테고리의 글 목록을 불러와 표시할 예정입니다.
        </p>
      </div>
    </div>
  );
} 