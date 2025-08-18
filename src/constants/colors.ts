import type { MapDifficulty } from '~/types/model/schema';

export const RARITY_COLORS = {
  COMMON: 'bg-gray-200',
  UNCOMMON: 'bg-green-200',
  RARE: 'bg-blue-200',
  EPIC: 'bg-purple-200',
  LEGENDARY: 'bg-red-200',
};

export const DIFFICULTY_COLORS: Record<MapDifficulty, string> = {
  easy: 'text-green-600 dark:text-green-400',
  normal: 'text-yellow-600 dark:text-yellow-400',
  hard: 'text-red-600 dark:text-red-400',
  extreme: 'text-purple-600 dark:text-purple-400',
};
