import { useMutation } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryClient, queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { BattleResponse } from '~/types/response/battle';

const BATTLE_ENDPOINTS = {
  startBattle: `/battle/start`,
} as const;

export const battleService = {
  startBattle: async ({
    characterId,
    mapZoneId,
  }: {
    characterId: string;
    mapZoneId: number;
  }): Promise<BaseResponse<BattleResponse>> => {
    return apiClient.post(BATTLE_ENDPOINTS.startBattle, {
      character_id: characterId,
      map_zone_id: mapZoneId,
    });
  },
};

export const useStartBattle = () => {
  return useMutation({
    mutationKey: queryKeys.battle.start,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
    },
    mutationFn: (data: { characterId: string; mapZoneId: number }) =>
      battleService.startBattle(data),
  });
};
