import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseRequest, BaseResponse } from '~/types/api';
import type { MapZoneDetail } from '~/types/map';

const MAP_ZONE_ENDPOINTS = {
  all: '/map-zones',
  detail: (id: string | number) => `/map-zones/${id}`,
} as const;

export const mapZoneService = {
  getAll: async (
    request: BaseRequest
  ): Promise<BaseResponse<MapZoneDetail[]>> => {
    return apiClient.get(MAP_ZONE_ENDPOINTS.all, {
      params: {
        limit: request.limit,
        page: request.page,
        search: request.search,
      },
    });
  },

  getDetail: async (
    id: string | number
  ): Promise<BaseResponse<MapZoneDetail>> => {
    return apiClient.get(MAP_ZONE_ENDPOINTS.detail(id));
  },
};

export const useMapZones = (
  request: BaseRequest = { limit: 100, page: 1, search: '' }
) => {
  return useQuery({
    queryKey: queryKeys.mapZones.all,
    queryFn: () => mapZoneService.getAll(request),
  });
};

export const useMapZoneDetail = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.mapZones.detail(id),
    queryFn: () => mapZoneService.getDetail(id),
  });
};
