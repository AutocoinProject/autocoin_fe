"use client";

import React from 'react';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const { title, summary, source, date, imageUrl, tags } = news;
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
        {/* In a real implementation, this would be an actual image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Image Placeholder
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{summary}</p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{source}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          Read More →
        </button>
      </div>
    </div>
  );
}
