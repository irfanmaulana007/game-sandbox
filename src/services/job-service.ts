import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { JobClasses } from '~/types/model/schema';

const JOB_ENDPOINTS = {
  getJobs: `/job-classes`,
} as const;

export const jobService = {
  getJobs: async (): Promise<BaseResponse<JobClasses[]>> => {
    return apiClient.get(JOB_ENDPOINTS.getJobs);
  },
};

export const useJobs = () => {
  return useQuery({
    queryKey: queryKeys.jobs.all,
    queryFn: () => jobService.getJobs(),
  });
};
