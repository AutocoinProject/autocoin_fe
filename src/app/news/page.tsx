import React from 'react';
import NewsCard from './components/NewsCard';

export default function NewsPage() {
  // Sample news data
  const newsItems = [
    {
      id: 1,
      title: 'Bitcoin Reaches New All-Time High Above $70,000',
      summary: 'Bitcoin has surged past $70,000 for the first time, marking a historic milestone for the cryptocurrency.',
      source: 'CryptoNews',
      date: '2025-05-03T14:30:00',
      imageUrl: '/images/news/bitcoin-ath.jpg',
      tags: ['Bitcoin', 'Markets', 'Price Action']
    },
    {
      id: 2,
      title: 'SEC Approves Ethereum ETF Applications',
      summary: 'The Securities and Exchange Commission has approved multiple Ethereum ETF applications, paving the way for institutional investment.',
      source: 'Financial Times',
      date: '2025-05-02T09:15:00',
      imageUrl: '/images/news/eth-etf.jpg',
      tags: ['Ethereum', 'Regulation', 'ETF']
    },
    {
      id: 3,
      title: 'Major Bank Launches Cryptocurrency Custody Service',
      summary: 'One of the world\'s largest banks has announced the launch of a custody service for digital assets, targeting institutional clients.',
      source: 'Banking Daily',
      date: '2025-05-01T16:45:00',
      imageUrl: '/images/news/bank-crypto.jpg',
      tags: ['Banking', 'Adoption', 'Institutional']
    },
    {
      id: 4,
      title: 'New Layer 2 Solution Claims 100,000 TPS Breakthrough',
      summary: 'A new Ethereum Layer 2 scaling solution has demonstrated the ability to process over 100,000 transactions per second in testnet conditions.',
      source: 'Tech Insider',
      date: '2025-04-30T11:20:00',
      imageUrl: '/images/news/layer2-scaling.jpg',
      tags: ['Ethereum', 'Scaling', 'Technology']
    },
    {
      id: 5,
      title: 'Central Banks of G7 Countries Discuss CBDC Interoperability',
      summary: 'Central bank representatives from G7 nations met to discuss standards for making their central bank digital currencies interoperable.',
      source: 'Global Economics',
      date: '2025-04-29T10:00:00',
      imageUrl: '/images/news/cbdc-meeting.jpg',
      tags: ['CBDC', 'Regulation', 'Central Banks']
    },
    {
      id: 6,
      title: 'NFT Market Shows Signs of Recovery After Year-Long Slump',
      summary: 'Trading volumes in the NFT market have increased significantly in the past month, signaling a potential recovery after a prolonged downturn.',
      source: 'Art & Tech',
      date: '2025-04-28T13:40:00',
      imageUrl: '/images/news/nft-recovery.jpg',
      tags: ['NFT', 'Markets', 'Art']
    }
  ];

  // Featured news (first item in the list)
  const featuredNews = newsItems[0];
  
  // Rest of the news items
  const regularNews = newsItems.slice(1);
  
  // Popular tags
  const popularTags = ['Bitcoin', 'Ethereum', 'Regulation', 'DeFi', 'NFT', 'Trading', 'Technology', 'Adoption'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Crypto News</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search news..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Market News</option>
            <option>Regulation</option>
            <option>Technology</option>
            <option>Adoption</option>
          </select>
          
          <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
            <option>Latest First</option>
            <option>Oldest First</option>
            <option>Most Read</option>
          </select>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {popularTags.map(tag => (
          <button 
            key={tag} 
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
      
      {/* Featured News */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
          {/* In a real implementation, this would be an actual image */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Featured Image Placeholder
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex gap-2 mb-2">
              {featuredNews.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{featuredNews.title}</h2>
            <p className="text-white/80 text-sm mb-2">{featuredNews.summary}</p>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-xs">{featuredNews.source}</span>
              <span className="text-white/70 text-xs">
                {new Date(featuredNews.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularNews.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="flex justify-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Load More
        </button>
      </div>
      
      {/* Newsletter Subscription */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400">Subscribe to our newsletter for daily crypto news and analysis.</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 border-0 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
