import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { Monsters } from '~/types/model/schema';
import type { MonsterDetail } from '~/types/monster';

const MONSTER_ENDPOINTS = {
  all: `/monsters`,
  detail: (id: string | number) => `/monsters/${id}`,
  monsterDetail: (id: string | number) => `/monsters/monster-details/${id}`,
} as const;

export const monsterService = {
  getAll: async (): Promise<BaseResponse<Monsters[]>> => {
    return apiClient.get(MONSTER_ENDPOINTS.all);
  },

  getDetail: async (id: string | number): Promise<BaseResponse<Monsters>> => {
    return apiClient.get(MONSTER_ENDPOINTS.detail(id));
  },

  getMonsterDetail: async (
    id: string | number
  ): Promise<BaseResponse<MonsterDetail>> => {
    return apiClient.get(MONSTER_ENDPOINTS.monsterDetail(id));
  },
};

export const useMonsters = () => {
  return useQuery({
    queryKey: queryKeys.monsters.all,
    queryFn: () => monsterService.getAll(),
  });
};

export const useMonsterDetail = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.monsters.detail(id),
    queryFn: () => monsterService.getDetail(id),
  });
};

export const useMonsterDetailDetail = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.monsters.detail(id),
    queryFn: () => monsterService.getMonsterDetail(id),
  });
};
