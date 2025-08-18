import type { Equipment, EquipmentType, Rarity } from '~/types/model/schema';
import { Card, CardBody, CardHeader } from './ui';
import { numberFormat } from '~/utils/number';
import { useMemo } from 'react';

// Equipment Card Component
interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const getTypeIcon = (type: EquipmentType) => {
    const icons = {
      weapon: '⚔️',
      armor: '🛡️',
      accessory: '💍',
    };
    return icons[type];
  };

  const getRarityColor = (rarity: Rarity) => {
    const colors = {
      common: 'text-gray-600 dark:text-gray-400',
      uncommon: 'text-green-600 dark:text-green-400',
      rare: 'text-blue-600 dark:text-blue-400',
      epic: 'text-purple-600 dark:text-purple-400',
      legendary: 'text-red-600 dark:text-red-500',
    };
    return colors[rarity];
  };

  const equipmentStats = useMemo(() => {
    return {
      health: equipment.health_bonus,
      attack: equipment.attack_bonus,
      defense: equipment.defense_bonus,
      speed: equipment.speed_bonus,
      critical: equipment.critical_bonus,
    };
  }, [equipment]);

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(equipment.type)}</span>
            <div>
              <h3
                className={`font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 ${getRarityColor(equipment.rarity)}`}
              >
                {equipment.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Lv.{equipment.min_level}
                </span>
                <span className={`text-xs ${getRarityColor(equipment.rarity)}`}>
                  {equipment.rarity.charAt(0).toUpperCase() +
                    equipment.rarity.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <p className="mb-4 overflow-hidden text-ellipsis text-sm text-gray-600 dark:text-gray-300">
          {equipment.description}
        </p>

        {/* Status Stats */}
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(equipmentStats).map(([stat, value]) => (
              <div
                key={stat}
                className="flex items-center justify-between text-xs"
              >
                <span className="capitalize text-gray-600 dark:text-gray-400">
                  {stat}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  +{value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Buy:{' '}
            <span className="font-medium text-green-600 dark:text-green-400">
              {numberFormat(equipment.buy_price)}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Sell:{' '}
            <span className="font-medium text-red-600 dark:text-red-400">
              {numberFormat(equipment.sell_price)}
            </span>
          </div>
        </div>

        {/* Drop Rate */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Drop Rate: {(equipment.drop_rate * 100).toFixed(1)}%
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
