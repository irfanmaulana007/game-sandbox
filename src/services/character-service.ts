import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type {
  AllocateStatusPointsRequest,
  CreateCharacterRequest,
} from '~/types/request/character';
import type { Characters } from '~/types/model/schema';
import type { BaseResponse } from '~/types/api';
import type { CharacterWithJob } from '~/types/model/character';

const CHARACTER_ENDPOINTS = {
  me: '/characters/me',
  create: '/characters',
  update: (id: string | number) => `/characters/${id}`,
  allocateStatusPoints: (characterId: string) =>
    `/characters/${characterId}/allocate-stats`,
  resetStatusPoints: `/characters/me/reset-status-points`,
} as const;

export const characterService = {
  getMe: async (): Promise<BaseResponse<CharacterWithJob>> => {
    return apiClient.get(CHARACTER_ENDPOINTS.me);
  },

  createCharacter: async (
    characterData: CreateCharacterRequest
  ): Promise<BaseResponse<Characters>> => {
    return apiClient.post(CHARACTER_ENDPOINTS.create, characterData);
  },

  updateCharacter: async (
    id: string | number,
    characterData: Partial<Characters>
  ): Promise<BaseResponse<Characters>> => {
    return apiClient.put(CHARACTER_ENDPOINTS.update(id), characterData);
  },

  allocateStatusPoints: async (
    characterId: string,
    statusPoints: AllocateStatusPointsRequest
  ): Promise<BaseResponse<Characters>> => {
    return apiClient.post(
      CHARACTER_ENDPOINTS.allocateStatusPoints(characterId),
      statusPoints
    );
  },

  resetStatusPoints: async (): Promise<BaseResponse<Characters>> => {
    return apiClient.post(CHARACTER_ENDPOINTS.resetStatusPoints);
  },
};

export const useMyCharacter = () => {
  return useQuery({
    queryKey: queryKeys.characters.me,
    queryFn: characterService.getMe,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: characterService.createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
    },
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<Characters>;
    }) => characterService.updateCharacter(id, data),
    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(
        queryKeys.characters.detail(updatedCharacter.data.id),
        updatedCharacter
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
    },
  });
};

export const useAllocateStatusPoints = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      statusPoints,
    }: {
      characterId: string;
      statusPoints: AllocateStatusPointsRequest;
    }) => characterService.allocateStatusPoints(characterId, statusPoints),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
      onSuccess();
    },
  });
};

export const useResetStatusPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: characterService.resetStatusPoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
    },
  });
};
