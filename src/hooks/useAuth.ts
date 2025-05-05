"use client";

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export default function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Function to load user data
  const loadUser = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to fetch the user data
      // For now, let's simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/avatars/john.jpg'
      };
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      // Store auth token in localStorage
      localStorage.setItem('authToken', 'mock-auth-token');
    } catch (err) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to load user data'
      });
    }
  }, []);
  
  // Function to log in user
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to authenticate
      // For now, let's simulate a delay and authenticate with mock credentials
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock credential check
      if (email === 'john.doe@example.com' && password === 'password') {
        const user = {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: '/avatars/john.jpg'
        };
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Store auth token in localStorage
        localStorage.setItem('authToken', 'mock-auth-token');
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password'
        }));
        return false;
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred during login'
      }));
      return false;
    }
  }, []);
  
  // Function to log out user
  const logout = useCallback(() => {
    // Clear auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    
    // Remove auth token from localStorage
    localStorage.removeItem('authToken');
  }, []);
  
  // Function to register new user
  const register = useCallback(async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real application, this would be an API call to register
      // For now, let's simulate a delay and return success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '2', // New user ID
        name,
        email,
        avatar: undefined // New users don't have an avatar by default
      };
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      // Store auth token in localStorage
      localStorage.setItem('authToken', 'mock-auth-token');
      return true;
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred during registration'
      }));
      return false;
    }
  }, []);
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      loadUser();
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadUser]);
  
  return {
    ...authState,
    login,
    logout,
    register,
    loadUser
  };
}
