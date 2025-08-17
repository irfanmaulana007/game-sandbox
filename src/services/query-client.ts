import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Time before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry failed requests
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        if (
          error instanceof AxiosError &&
          error.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        if (error instanceof AxiosError && error.response?.status) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },

      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Character related queries
  characters: {
    all: ['characters'] as const,
    lists: () => [...queryKeys.characters.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.characters.lists(), { filters }] as const,
    details: () => [...queryKeys.characters.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.characters.details(), id] as const,
  },

  // Equipment related queries
  equipment: {
    all: ['equipment'] as const,
    lists: () => [...queryKeys.equipment.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.equipment.lists(), { filters }] as const,
    details: () => [...queryKeys.equipment.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.equipment.details(), id] as const,
    categories: () => [...queryKeys.equipment.all, 'categories'] as const,
  },

  // Monster related queries
  monsters: {
    all: ['monsters'] as const,
    lists: () => [...queryKeys.monsters.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.monsters.lists(), { filters }] as const,
    details: () => [...queryKeys.monsters.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.monsters.details(), id] as const,
  },

  // Map related queries
  maps: {
    all: ['maps'] as const,
    lists: () => [...queryKeys.maps.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.maps.lists(), { filters }] as const,
    details: () => [...queryKeys.maps.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.maps.details(), id] as const,
  },

  // Battle related queries
  battles: {
    all: ['battles'] as const,
    history: () => [...queryKeys.battles.all, 'history'] as const,
    current: () => [...queryKeys.battles.all, 'current'] as const,
  },

  // User/Profile related queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    inventory: () => [...queryKeys.user.all, 'inventory'] as const,
    stats: () => [...queryKeys.user.all, 'stats'] as const,
  },
} as const;
