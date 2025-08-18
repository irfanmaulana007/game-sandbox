import { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { axiosInstance } from '~/constants/instance';

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
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

export const apiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then((response) => response.data),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance.post<T>(url, data, config).then((response) => response.data),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance.put<T>(url, data, config).then((response) => response.data),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance.patch<T>(url, data, config).then((response) => response.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then((response) => response.data),
};
