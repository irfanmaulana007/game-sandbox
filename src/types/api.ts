export interface BaseResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errorStatus?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BaseRequest {
  limit?: number;
  page?: number;
  search?: string;
}