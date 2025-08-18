import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api';
import type { BaseResponse } from '~/types/api';
import type { Users } from '~/types/model/schema';

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

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  getUser: '/auth/me',
} as const;

export const authService = {
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

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.logout);
    } catch (error) {
      console.error('Logout error:', error);
      console.warn('Logout server call failed, clearing local tokens');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

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

    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);

    return response;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  getUser: async (): Promise<BaseResponse<Users>> => {
    const response = await apiClient.get<BaseResponse<Users>>(
      AUTH_ENDPOINTS.getUser
    );
    return response;
  },
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (authResponse) => {
      queryClient.clear();

      queryClient.setQueryData(['user', 'profile'], authResponse.data.user);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (authResponse) => {
      queryClient.clear();

      queryClient.setQueryData(['user', 'profile'], authResponse.data.user);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();

      window.location.href = '/login';
    },
  });
};
