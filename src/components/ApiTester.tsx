'use client';

import { useState } from 'react';
import config from '@/config/environment';

export default function ApiTester() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testUserInfo = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setResult({ error: 'No token found' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.text();
        setResult({ 
          error: `${response.status} ${response.statusText}`, 
          details: errorData 
        });
      }
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="font-bold mb-3">API Test - User Info</h3>
      <button
        onClick={testUserInfo}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test /api/v1/auth/me'}
      </button>
      
      {result && (
        <pre className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
