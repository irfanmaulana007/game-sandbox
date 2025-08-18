import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { Equipment, Rarity } from '~/types/model/schema';
import type { EquipmentType } from '~/types/equipment';

const EQUIPMENT_ENDPOINTS = {
  all: '/equipment',
  detail: (id: string) => `/equipment/${id}`,
} as const;

export const equipmentService = {
  all: async (
    type: EquipmentType | undefined,
    rarity: Rarity | undefined,
    minLevel: number | undefined
  ): Promise<BaseResponse<Equipment[]>> => {
    const params = new URLSearchParams();
    params.append('limit', '500');
    if (type) params.append('type', type);
    if (rarity) params.append('rarity', rarity);
    if (minLevel) params.append('min_level', minLevel.toString());

    return apiClient.get(`${EQUIPMENT_ENDPOINTS.all}?${params.toString()}`);
  },
  detail: async (id: string): Promise<BaseResponse<Equipment>> => {
    return apiClient.get(EQUIPMENT_ENDPOINTS.detail(id));
  },
};

export const useEquipment = (
  type: EquipmentType | undefined,
  rarity: Rarity | undefined,
  minLevel: number | undefined
) => {
  return useQuery({
    queryKey: queryKeys.equipment.all(type, rarity, minLevel),
    queryFn: () => equipmentService.all(type, rarity, minLevel),
  });
};

export const useEquipmentDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.equipment.detail(id),
    queryFn: () => equipmentService.detail(id),
  });
};
