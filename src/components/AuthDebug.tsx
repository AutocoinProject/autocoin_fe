'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="fixed top-20 right-4 bg-red-100 border border-red-400 p-3 rounded text-xs z-50">
      <div><strong>Debug Info:</strong></div>
      <div>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>isLoading: {isLoading ? 'true' : 'false'}</div>
      <div>user: {user ? user.username : 'null'}</div>
      <div>localStorage authToken: {typeof window !== 'undefined' ? (localStorage.getItem('authToken') ? 'exists' : 'none') : 'N/A'}</div>
      <div>localStorage user: {typeof window !== 'undefined' ? (localStorage.getItem('user') ? 'exists' : 'none') : 'N/A'}</div>
    </div>
  );
}
