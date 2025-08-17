import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        'API Request:',
        config.method?.toUpperCase(),
        config.url,
        config.data
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        'API Response:',
        response.status,
        response.config.url,
        response.data
      );
    }

    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      console.log('🚀 ~ error.response:', error.response);

      switch (status) {
        case 400:
          // Bad request
          toast.error('Bad request', {
            description: data.error,
          });
          break;
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          toast.error('Unauthorized', {
            description: data.error,
          });
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data);
          toast.error('Forbidden', {
            description: data.error,
          });
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data);
          toast.error('Not found', {
            description: data.error,
          });
          break;
        case 500:
          // Server error
          console.error('Server error:', data);
          toast.error('Server error', {
            description: data.error,
          });
          break;
        default:
          toast.error('API Error', {
            description: data.error,
          });
          console.error(`API Error ${status}:`, data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      toast.error('Network error', {
        description: error.message,
      });
    } else {
      // Other error
      console.error('API Error:', error.message);
      toast.error('API Error', {
        description: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then((response) => response.data),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => api.post<T>(url, data, config).then((response) => response.data),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => api.put<T>(url, data, config).then((response) => response.data),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => api.patch<T>(url, data, config).then((response) => response.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then((response) => response.data),
};

export default api;
