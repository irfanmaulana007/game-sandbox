import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api';
import type { BaseResponse } from '~/types/api';
import type { Users } from '~/types/model/schema';

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: Users;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// API endpoints
const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  getUser: '/auth/me',
} as const;

// Service functions
export const authService = {
  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<BaseResponse<AuthResponse>> => {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(
      AUTH_ENDPOINTS.login,
      credentials
    );

    // Store tokens in localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);

    return response;
  },

  // Register user
  register: async (
    userData: RegisterData
  ): Promise<BaseResponse<AuthResponse>> => {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(
      AUTH_ENDPOINTS.register,
      userData
    );

    // Store tokens in localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);

    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint to invalidate tokens on server
      await apiClient.post(AUTH_ENDPOINTS.logout);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server call fails, clear local tokens
      console.warn('Logout server call failed, clearing local tokens');
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Refresh access token
  refreshToken: async (): Promise<BaseResponse<RefreshTokenResponse>> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<BaseResponse<RefreshTokenResponse>>(
      AUTH_ENDPOINTS.refresh,
      {
        refreshToken,
      }
    );

    // Update stored token
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);

    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  // Get user
  getUser: async (): Promise<BaseResponse<Users>> => {
    const response = await apiClient.get<BaseResponse<Users>>(
      AUTH_ENDPOINTS.getUser
    );
    return response;
  },
};

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (authResponse) => {
      // Clear any existing user data
      queryClient.clear();

      // Set user data in cache
      queryClient.setQueryData(['user', 'profile'], authResponse.data.user);

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (authResponse) => {
      // Clear any existing user data
      queryClient.clear();

      // Set user data in cache
      queryClient.setQueryData(['user', 'profile'], authResponse.data.user);

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      // Redirect to login page
      window.location.href = '/login';
    },
  });
};
