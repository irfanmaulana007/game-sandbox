import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from './query-client';
import type { CharacterModelType as Character } from '@game-sandbox/types';

// API endpoints
const CHARACTER_ENDPOINTS = {
  list: '/characters',
  detail: (id: string | number) => `/characters/${id}`,
  create: '/characters',
  update: (id: string | number) => `/characters/${id}`,
  delete: (id: string | number) => `/characters/${id}`,
  levelUp: (id: string | number) => `/characters/${id}/level-up`,
  addExperience: (id: string | number) => `/characters/${id}/experience`,
} as const;

// Service functions
export const characterService = {
  // Get all characters
  getCharacters: async (filters?: string): Promise<Character[]> => {
    const params = filters ? `?${filters}` : '';
    return apiClient.get(CHARACTER_ENDPOINTS.list + params);
  },

  // Get character by ID
  getCharacter: async (id: string | number): Promise<Character> => {
    return apiClient.get(CHARACTER_ENDPOINTS.detail(id));
  },

  // Create new character
  createCharacter: async (
    characterData: Partial<Character>
  ): Promise<Character> => {
    return apiClient.post(CHARACTER_ENDPOINTS.create, characterData);
  },

  // Update character
  updateCharacter: async (
    id: string | number,
    characterData: Partial<Character>
  ): Promise<Character> => {
    return apiClient.put(CHARACTER_ENDPOINTS.update(id), characterData);
  },

  // Delete character
  deleteCharacter: async (id: string | number): Promise<void> => {
    return apiClient.delete(CHARACTER_ENDPOINTS.delete(id));
  },

  // Level up character
  levelUpCharacter: async (id: string | number): Promise<Character> => {
    return apiClient.post(CHARACTER_ENDPOINTS.levelUp(id));
  },

  // Add experience to character
  addExperience: async (
    id: string | number,
    experience: number
  ): Promise<Character> => {
    return apiClient.post(CHARACTER_ENDPOINTS.addExperience(id), {
      experience,
    });
  },
};

// React Query hooks
export const useCharacters = (filters?: string) => {
  return useQuery({
    queryKey: queryKeys.characters.list(filters || ''),
    queryFn: () => characterService.getCharacters(filters),
  });
};

export const useCharacter = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.characters.detail(id),
    queryFn: () => characterService.getCharacter(id),
    enabled: !!id,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: characterService.createCharacter,
    onSuccess: () => {
      // Invalidate and refetch characters list
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.lists() });
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
      data: Partial<Character>;
    }) => characterService.updateCharacter(id, data),
    onSuccess: (updatedCharacter) => {
      // Update character in cache
      queryClient.setQueryData(
        queryKeys.characters.detail(updatedCharacter.id),
        updatedCharacter
      );
      // Invalidate characters list
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.lists() });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: characterService.deleteCharacter,
    onSuccess: (_, deletedId) => {
      // Remove character from cache
      queryClient.removeQueries({
        queryKey: queryKeys.characters.detail(deletedId),
      });
      // Invalidate characters list
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.lists() });
    },
  });
};

export const useLevelUpCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: characterService.levelUpCharacter,
    onSuccess: (updatedCharacter) => {
      // Update character in cache
      queryClient.setQueryData(
        queryKeys.characters.detail(updatedCharacter.id),
        updatedCharacter
      );
      // Invalidate characters list
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.lists() });
    },
  });
};

export const useAddExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      experience,
    }: {
      id: string | number;
      experience: number;
    }) => characterService.addExperience(id, experience),
    onSuccess: (updatedCharacter) => {
      // Update character in cache
      queryClient.setQueryData(
        queryKeys.characters.detail(updatedCharacter.id),
        updatedCharacter
      );
      // Invalidate characters list
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.lists() });
    },
  });
};
