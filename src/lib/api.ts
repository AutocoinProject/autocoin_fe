// API Utilities for making requests to the backend

import { refreshToken } from './auth';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';

// Create a re-usable fetch function with authentication and error handling
export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Set default options
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };

  // Get auth token from storage
  const token = localStorage.getItem('authToken');

  // If we have a token, add it to the headers
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Merge default options with provided options
  const fetchOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Set up timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  fetchOptions.signal = controller.signal;
  
  try {
    // Perform the fetch
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Handle 401 Unauthorized error (token expired)
    if (response.status === 401) {
      // Try to refresh the token
      const success = await refreshToken();
      
      if (success) {
        // Retry the request with the new token
        return fetchWithAuth<T>(endpoint, options);
      } else {
        // Token refresh failed, redirect to login
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }
    }
    
    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || response.statusText || 'Unknown error';
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }
    
    // Parse and return the response data
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    } else {
      // For non-JSON responses (like file downloads)
      return response as unknown as T;
    }
  } catch (err) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    // Handle aborted requests
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    // Re-throw the error
    throw err;
  }
}

// Helper functions for different HTTP methods
export async function get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return fetchWithAuth<T>(endpoint, { ...options, method: 'GET' });
}

export async function post<T>(
  endpoint: string,
  data: unknown,
  options: RequestInit = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function put<T>(
  endpoint: string,
  data: unknown,
  options: RequestInit = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function patch<T>(
  endpoint: string,
  data: unknown,
  options: RequestInit = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function del<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: 'DELETE'
  });
}

// Form data helper for multipart/form-data requests (file uploads)
export async function postFormData<T>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  // Remove Content-Type header to let the browser set it with the boundary
  const { headers, ...restOptions } = options;
  const { 'Content-Type': _, ...restHeaders } = headers as Record<string, string> || {};
  
  return fetchWithAuth<T>(endpoint, {
    ...restOptions,
    headers: restHeaders,
    method: 'POST',
    body: formData
  });
}
