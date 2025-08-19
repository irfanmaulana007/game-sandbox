import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { CharacterEquipmentWithEquipment } from '~/types/model/characterEquipment';

const CHARACTER_EQUIPMENT_ENDPOINTS = {
  all: (characterId: string) => `/character-equipment/${characterId}`,
} as const;

export const characterEquipmentService = {
  all: async (
    characterId: string
  ): Promise<BaseResponse<CharacterEquipmentWithEquipment[]>> => {
    return apiClient.get(CHARACTER_EQUIPMENT_ENDPOINTS.all(characterId));
  },
};

export const useCharacterEquipment = (characterId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.characterEquipment.all(characterId ?? ''),
    enabled: !!characterId,
    queryFn: () => characterEquipmentService.all(characterId ?? ''),
  });
};
