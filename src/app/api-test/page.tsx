'use client';

import React from 'react';

export default function ApiTestPage() {
  return (
    <div>
      <h1>API 테스트 페이지</h1>
      <p>간단한 API 테스트 페이지입니다.</p>
      <button 
        onClick={() => alert('API 테스트')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        테스트 버튼
      </button>
    </div>
  );
}