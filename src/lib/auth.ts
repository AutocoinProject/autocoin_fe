// Authentication utilities

import { API_BASE_URL } from '@/constants/api';

// Types
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Function to refresh the authentication token
export async function refreshToken(): Promise<boolean> {
  try {
    // In a real application, this would call the token refresh endpoint
    // For now, we'll simulate a successful token refresh
    
    // Try to get the refresh token from storage
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Make the request to refresh the token
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    // Parse the response
    const data: AuthTokens = await response.json();
    
    // Store the new tokens
    localStorage.setItem('authToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return true;
  } catch (err) {
    // Clear auth tokens on failure
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return false;
  }
}

// Function to login user
export async function login(email: string, password: string): Promise<UserData | null> {
  try {
    // In a real application, this would call the login endpoint
    // For demonstration, we'll simulate a login response
    
    // To simulate a real API call:
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    // Parse the response
    const data = await response.json();
    
    // Store the tokens
    localStorage.setItem('authToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.user;
  } catch (err) {
    // For demonstration purposes, return mock data if email/password match
    if (email === 'john.doe@example.com' && password === 'password') {
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
      
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/avatars/john.jpg'
      };
      
      // Store mock tokens
      localStorage.setItem('authToken', mockTokens.accessToken);
      localStorage.setItem('refreshToken', mockTokens.refreshToken);
      
      return mockUser;
    }
    
    return null;
  }
}

// Function to logout user
export function logout(): void {
  // Clear tokens
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  
  // In a real application, you might also want to call an API endpoint to invalidate the token
}

// Function to register a new user
export async function register(
  name: string,
  email: string,
  password: string
): Promise<UserData | null> {
  try {
    // In a real application, this would call the registration endpoint
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    // Parse the response
    const data = await response.json();
    
    // Store the tokens
    localStorage.setItem('authToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.user;
  } catch (err) {
    // For demonstration, create a mock user
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
    
    const mockUser = {
      id: '2',
      name,
      email,
      avatar: undefined
    };
    
    // Store mock tokens
    localStorage.setItem('authToken', mockTokens.accessToken);
    localStorage.setItem('refreshToken', mockTokens.refreshToken);
    
    return mockUser;
  }
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

// Function to get the current user
export async function getCurrentUser(): Promise<UserData | null> {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    // In a real application, this would call the user endpoint
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh the token
        const success = await refreshToken();
        
        if (success) {
          // Retry the request
          return getCurrentUser();
        } else {
          throw new Error('Authentication failed');
        }
      }
      
      throw new Error('Failed to get user data');
    }
    
    return await response.json();
  } catch (err) {
    // For demonstration, return a mock user
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatars/john.jpg'
    };
  }
}
