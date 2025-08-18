import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';

interface LevelExperienceResponse {
  currentLevel: 2;
  nextLevel: 3;
  experienceToNext: 450;
  progress: 0;
  currentExperience: 300;
  nextLevelExperience: 750;
}

const EXPERIENCE_ENDPOINTS = {
  getLevelExperience: (experience: number) => `/experience/next/${experience}`,
} as const;

export const experienceService = {
  getLevelExperience: async (
    experience: number | undefined
  ): Promise<BaseResponse<LevelExperienceResponse>> => {
    return apiClient.get(
      EXPERIENCE_ENDPOINTS.getLevelExperience(experience || 0)
    );
  },
};

export const useLevelExperience = (experience: number | undefined) => {
  return useQuery({
    queryKey: queryKeys.experience.getLevelExperience(experience),
    queryFn: () => experienceService.getLevelExperience(experience),
    enabled: experience !== undefined,
  });
};
