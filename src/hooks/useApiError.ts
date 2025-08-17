import type { AxiosResponse } from 'axios';
import { useToast } from '~/hooks';

interface ApiError {
  message?: string;
  status?: number;
  data?: unknown;
}

export const useApiError = () => {
  const { error: showError, warning: showWarning } = useToast();

  const handleError = (
    error: ApiError | unknown,
    fallbackMessage = 'An error occurred'
  ) => {
    let message = fallbackMessage;
    let status: number | undefined;

    if (error && typeof error === 'object') {
      // Handle Axios error response
      if ('response' in error && error.response) {
        const response = error.response as AxiosResponse;
        status = response.status;

        if (response.data?.message) {
          message = response.data.message;
        } else if (response.status === 401) {
          message = 'Authentication required. Please log in again.';
        } else if (response.status === 403) {
          message = "Access denied. You don't have permission for this action.";
        } else if (response.status === 404) {
          message = 'Resource not found.';
        } else if (response.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (response.status >= 400 && response.status < 500) {
          message = 'Invalid request. Please check your input.';
        } else if (response.status >= 500) {
          message = 'Server error. Please try again later.';
        }
      }
      // Handle network errors
      else if ('request' in error && !error.request) {
        message = 'Network error. Please check your connection.';
      }
      // Handle other errors
      else if ('message' in error && error.message) {
        message = error.message as string;
      }
    }

    // Show appropriate toast based on error type
    if (status === 401 || status === 403) {
      showWarning(message);
    } else {
      showError(message);
    }

    return message;
  };

  return { handleError };
};
