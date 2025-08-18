import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseRequest, BaseResponse } from '~/types/api';
import type { MapWithZone } from '~/types/model/map';

const MAP_ENDPOINTS = {
  all: '/maps',
  detail: (id: string | number) => `/maps/${id}`,
} as const;

export const mapService = {
  getAll: async (
    request: BaseRequest
  ): Promise<BaseResponse<MapWithZone[]>> => {
    return apiClient.get(MAP_ENDPOINTS.all, {
      params: {
        limit: request.limit,
        page: request.page,
        search: request.search,
      },
    });
  },

  getDetail: async (
    id: string | number
  ): Promise<BaseResponse<MapWithZone>> => {
    return apiClient.get(MAP_ENDPOINTS.detail(id));
  },
};

export const useMaps = (
  request: BaseRequest = { limit: 20, page: 1, search: '' }
) => {
  return useQuery({
    queryKey: queryKeys.maps.all,
    queryFn: () => mapService.getAll(request),
  });
};

export const useMapDetail = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.maps.detail(id),
    queryFn: () => mapService.getDetail(id),
  });
};
