import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError, type AxiosInstance } from 'axios';
import type {
  EquipmentSlot,
  EquipmentType,
  Rarity,
} from '~/types/model/schema';

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        if (
          error instanceof AxiosError &&
          error.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        if (error instanceof AxiosError && error.response?.status) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

export const queryKeys = {
  characters: {
    me: ['characters', 'me'] as const,
    all: ['characters'] as const,
    detail: (id: string | number) => [...queryKeys.characters.all, id] as const,
  },

  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    inventory: () => [...queryKeys.user.all, 'inventory'] as const,
    stats: () => [...queryKeys.user.all, 'stats'] as const,
  },

  maps: {
    all: ['maps'] as const,
    detail: (id: string | number) => [...queryKeys.maps.all, id] as const,
  },

  mapZones: {
    all: ['map-zones'] as const,
    detail: (id: string | number) => [...queryKeys.mapZones.all, id] as const,
  },

  experience: {
    getLevelExperience: (experience: number | undefined) =>
      ['experience', 'getLevelExperience', experience] as const,
  },

  jobs: {
    all: ['jobs'] as const,
    detail: (id: string | number) => [...queryKeys.jobs.all, id] as const,
  },

  battle: {
    start: ['battle', 'start'] as const,
  },

  monsters: {
    all: ['monsters'] as const,
    detail: (id: string | number) => [...queryKeys.monsters.all, id] as const,
    monsterDetail: (id: string | number) =>
      [...queryKeys.monsters.all, id] as const,
  },

  equipment: {
    all: (
      type: EquipmentType | undefined,
      rarity: Rarity | undefined,
      minLevel: number | undefined
    ) => ['equipments', type, rarity, minLevel] as const,
    detail: (id: string | number) => ['equipment', id] as const,
  },

  characterEquipment: {
    all: (characterId: string) => ['character-equipment', characterId] as const,
  },

  characterEquippedItems: {
    all: (characterId: string) =>
      ['character-equipped-items', characterId] as const,
    equipped: (characterId: string) =>
      ['character-equipped-items', characterId, 'equipped'] as const,
    equippedBySlot: (characterId: string, slot: EquipmentSlot) =>
      ['character-equipped-items', characterId, 'equipped', slot] as const,
    equipToSlot: (
      characterId: string,
      equipmentId: number,
      slot: EquipmentSlot
    ) =>
      [
        'character-equipped-items',
        characterId,
        'equip',
        equipmentId,
        slot,
      ] as const,
    unEquipByItem: (characterId: string, equipmentId: number) =>
      [
        'character-equipped-items',
        characterId,
        'unequip',
        equipmentId,
      ] as const,
    unEquipBySlot: (characterId: string, slot: EquipmentSlot) =>
      ['character-equipped-items', characterId, 'unequip-slot', slot] as const,
    swapEquipment: (
      characterId: string,
      equipmentId: number,
      slot: EquipmentSlot
    ) =>
      [
        'character-equipped-items',
        characterId,
        'swap',
        equipmentId,
        slot,
      ] as const,
  },
} as const;
