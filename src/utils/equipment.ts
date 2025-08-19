import type { Equipment } from '~/types/model/schema';

export const calculateTotalAttributes = (equipment: Equipment): number => {
  return (
    equipment.health_bonus +
    equipment.attack_bonus +
    equipment.defense_bonus +
    equipment.speed_bonus +
    equipment.critical_bonus
  );
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'uncommon':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'rare':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'epic':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getRarityLabel = (rarity: string): string => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
};
