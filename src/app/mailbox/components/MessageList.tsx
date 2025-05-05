"use client";

import React, { useState } from 'react';

interface Message {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  labels?: string[];
}

export default function MessageList() {
  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg1',
      from: {
        name: 'Coinbase',
        email: 'no-reply@coinbase.com',
        avatar: '/avatars/coinbase.jpg'
      },
      subject: 'Your Weekly Portfolio Summary',
      preview: 'Your portfolio has increased by 5.8% this week. Bitcoin is up 2.3% and Ethereum is up 7.5%.',
      date: '2025-05-05T09:30:00',
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      labels: ['important']
    },
    {
      id: 'msg2',
      from: {
        name: 'Kraken',
        email: 'support@kraken.com',
        avatar: '/avatars/kraken.jpg'
      },
      subject: 'Security Alert: New Login Detected',
      preview: 'We detected a new login to your Kraken account from a new device. If this was you, you can ignore this message.',
      date: '2025-05-04T18:45:00',
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      labels: ['important']
    },
    {
      id: 'msg3',
      from: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        avatar: '/avatars/john.jpg'
      },
      subject: 'Transaction Confirmation',
      preview: 'I\'ve sent the 0.5 BTC we discussed. Please let me know when you receive it and we can move forward with the project.',
      date: '2025-05-03T14:20:00',
      isRead: false,
      isStarred: true,
      hasAttachment: true,
      labels: ['personal']
    },
    {
      id: 'msg4',
      from: {
        name: 'Binance',
        email: 'no-reply@binance.com',
        avatar: '/avatars/binance.jpg'
      },
      subject: 'Your Monthly Statement is Available',
      preview: 'Your May 2025 account statement is now available. View your trading activity, deposits, withdrawals, and more.',
      date: '2025-05-02T10:15:00',
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      labels: []
    },
    {
      id: 'msg5',
      from: {
        name: 'CryptoTax Pro',
        email: 'support@cryptotaxpro.com',
        avatar: '/avatars/cryptotax.jpg'
      },
      subject: 'Your Q1 Tax Report is Ready',
      preview: 'We\'ve prepared your Q1 2025 cryptocurrency tax report. Please review it and let us know if you have any questions.',
      date: '2025-05-01T16:40:00',
      isRead: true,
      isStarred: true,
      hasAttachment: true,
      labels: ['work']
    },
    {
      id: 'msg6',
      from: {
        name: 'Mary Johnson',
        email: 'mary.johnson@example.com',
        avatar: '/avatars/mary.jpg'
      },
      subject: 'Upcoming Crypto Conference',
      preview: 'Just wanted to let you know about the upcoming cryptocurrency conference in New York next month. Are you planning to attend?',
      date: '2025-04-30T11:55:00',
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      labels: ['personal']
    }
  ]);
  
  // State for selected message
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, return time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // If this year, return month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Otherwise return date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const toggleStar = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, isStarred: !message.isStarred } 
        : message
    ));
  };
  
  const markAsRead = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, isRead: true } 
        : message
    ));
  };
  
  const handleMessageClick = (id: string) => {
    markAsRead(id);
    setSelectedMessageId(id === selectedMessageId ? null : id);
  };
  
  // Get the selected message
  const selectedMessage = selectedMessageId 
    ? messages.find(m => m.id === selectedMessageId) 
    : null;
  
  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      {/* Message list */}
      <div className={`md:w-80 lg:w-96 overflow-y-auto flex-shrink-0 border-r border-gray-200 dark:border-gray-700 ${selectedMessage ? 'hidden md:block' : 'w-full'}`}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                message.isRead ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/10'
              } ${selectedMessageId === message.id ? 'border-l-4 border-blue-500' : ''}`}
              onClick={() => handleMessageClick(message.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {message.from.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${message.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {message.from.name}
                    </p>
                    <div className="flex items-center">
                      {message.hasAttachment && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                      )}
                      <button
                        className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                      >
                        {message.isStarred ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </button>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(message.date)}
                      </span>
                    </div>
                  </div>
                  <h4 className={`text-sm ${message.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>
                    {message.subject}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {message.preview}
                  </p>
                  {message.labels && message.labels.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {message.labels.map(label => {
                        const labelColors: Record<string, { bg: string, text: string }> = {
                          important: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
                          personal: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' },
                          work: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
                          promotions: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' }
                        };
                        
                        const { bg, text } = labelColors[label] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' };
                        
                        return (
                          <span key={label} className={`px-2 py-0.5 rounded-full text-xs ${bg} ${text}`}>
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Message detail view */}
      {selectedMessage ? (
        <div className={`flex-1 overflow-y-auto ${selectedMessage ? 'block' : 'hidden md:block'}`}>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{selectedMessage.subject}</h2>
                <div className="flex space-x-2">
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                  </button>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 md:hidden"
                    onClick={() => setSelectedMessageId(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-lg font-medium mr-4">
                  {selectedMessage.from.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-gray-800 dark:text-white font-medium">{selectedMessage.from.name}</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">&lt;{selectedMessage.from.email}&gt;</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    To: me
                  </div>
                </div>
                <div className="ml-auto text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(selectedMessage.date).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="prose dark:prose-invert max-w-none">
                <p>{selectedMessage.preview}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non justo a est varius eleifend. Suspendisse potenti. Nulla facilisi. Nulla facilisi. Aenean euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nunc nisl eget nunc.</p>
                <p>Best regards,<br />{selectedMessage.from.name}</p>
              </div>
              
              {selectedMessage.hasAttachment && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments (1)</h4>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="bg-white dark:bg-gray-600 rounded p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 dark:text-white">Document.pdf</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">250 KB</div>
                    </div>
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">
                      Download
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Reply
                </button>
                <button className="ml-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hidden md:flex">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Select a message to read</p>
            <p className="text-sm mt-2">Or compose a new message</p>
          </div>
        </div>
      )}
    </div>
  );
}
