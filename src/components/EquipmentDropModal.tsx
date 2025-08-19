import React from 'react';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import type { Equipment } from '~/types/model/schema';

interface EquipmentDropModalProps {
  isVisible: boolean;
  onClose: () => void;
  equipment: Equipment | null;
}

const EquipmentDropModal: React.FC<EquipmentDropModalProps> = ({
  isVisible,
  onClose,
  equipment,
}) => {
  if (!isVisible || !equipment) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'uncommon':
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
      case 'rare':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
      case 'epic':
        return 'bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-200';
      case 'legendary':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'border-gray-300 dark:border-gray-600';
      case 'uncommon':
        return 'border-green-300 dark:border-green-600';
      case 'rare':
        return 'border-blue-300 dark:border-blue-600';
      case 'epic':
        return 'border-purple-300 dark:border-purple-600';
      case 'legendary':
        return 'border-yellow-300 dark:border-yellow-600';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weapon':
        return '⚔️';
      case 'armor':
        return '🛡️';
      case 'accessory':
        return '💍';
      default:
        return '🎒';
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 fixed bottom-6 right-6 z-50 duration-300">
      <Card
        className={`w-80 border-2 ${getRarityBorder(equipment.rarity)} bg-gradient-to-br from-white to-gray-50 shadow-2xl dark:from-gray-800 dark:to-gray-900`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                <span className="text-sm font-bold text-white">🎁</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Equipment Found!
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          {/* Equipment Header */}
          <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {getEquipmentIcon(equipment.type)}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 dark:text-white">
                  {equipment.name}
                </h4>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRarityColor(equipment.rarity)}`}
                  >
                    {equipment.rarity.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Level {equipment.min_level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Description */}
          {equipment.description && (
            <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {equipment.description}
              </p>
            </div>
          )}

          {/* Equipment Stats */}
          <div className="space-y-2">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Equipment Stats
            </h4>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Health
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +{equipment.health_bonus}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Attack
              </span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                +{equipment.attack_bonus}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Defense
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                +{equipment.defense_bonus}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Speed
              </span>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                +{equipment.speed_bonus}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Critical
              </span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                +{equipment.critical_bonus}
              </span>
            </div>
          </div>

          {/* Equipment Value */}
          <div className="mt-4 flex items-center justify-between rounded-md bg-gradient-to-r from-yellow-50 to-orange-50 p-3 dark:from-yellow-900/20 dark:to-orange-900/20">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Value
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-lg">💰</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {equipment.sell_price.toLocaleString()}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EquipmentDropModal;
