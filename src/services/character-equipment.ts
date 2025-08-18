import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { CharacterEquipmentWithEquipment } from '~/types/model/characterEquipment';

const CHARACTER_EQUIPMENT_ENDPOINTS = {
  all: (characterId: string) => `/character-equipment/${characterId}`,
  equipped: (characterId: string) =>
    `/character-equipment/${characterId}/equipped`,
} as const;

export const characterEquipmentService = {
  all: async (
    characterId: string
  ): Promise<BaseResponse<CharacterEquipmentWithEquipment[]>> => {
    return apiClient.get(CHARACTER_EQUIPMENT_ENDPOINTS.all(characterId));
  },
  equipped: async (
    characterId: string
  ): Promise<BaseResponse<CharacterEquipmentWithEquipment[]>> => {
    return apiClient.get(CHARACTER_EQUIPMENT_ENDPOINTS.equipped(characterId));
  },
};

export const useCharacterEquipment = (characterId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.characterEquipment.all(characterId ?? ''),
    enabled: !!characterId,
    queryFn: () => characterEquipmentService.all(characterId ?? ''),
  });
};

export const useCharacterEquipped = (characterId: string) => {
  return useQuery({
    queryKey: queryKeys.characterEquipment.equipped(characterId),
    queryFn: () => characterEquipmentService.equipped(characterId),
  });
};
