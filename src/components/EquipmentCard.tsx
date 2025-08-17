import type { Equipment, EquipmentType } from '~/types/equipment';
import type { Item } from '~/types/item';
import { Card, CardBody, CardHeader } from './ui';
import { numberFormat } from '~/utils/number';

// Equipment Card Component
interface EquipmentCardProps {
  equipment: Equipment;
  item: Item;
}

export default function EquipmentCard({ equipment, item }: EquipmentCardProps) {
  const getTypeIcon = (type: EquipmentType) => {
    const icons = {
      weapon: '⚔️',
      armor: '🛡️',
      accessory: '💍',
    };
    return icons[type];
  };

  const getRarityColor = (rarity: Item['rarity']) => {
    const colors = {
      common: 'text-gray-600 dark:text-gray-400',
      uncommon: 'text-green-600 dark:text-green-400',
      rare: 'text-blue-600 dark:text-blue-400',
      epic: 'text-purple-600 dark:text-purple-400',
      legendary: 'text-red-600 dark:text-red-500',
    };
    return colors[rarity];
  };

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(equipment.type)}</span>
            <div>
              <h3
                className={`font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 ${getRarityColor(item.rarity)}`}
              >
                {item.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Lv.{equipment.minLevel}
                </span>
                <span className={`text-xs ${getRarityColor(item.rarity)}`}>
                  {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <p className="mb-4 overflow-hidden text-ellipsis text-sm text-gray-600 dark:text-gray-300">
          {item.description}
        </p>

        {/* Status Stats */}
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(equipment.status).map(([stat, value]) => (
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
              {numberFormat(item.price.buy)}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Sell:{' '}
            <span className="font-medium text-red-600 dark:text-red-400">
              {numberFormat(item.price.sell)}
            </span>
          </div>
        </div>

        {/* Drop Rate */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Drop Rate: {(item.dropRate * 100).toFixed(1)}%
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
