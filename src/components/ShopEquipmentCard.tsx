import { Card, CardHeader, CardBody, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { getRarityColor, getRarityLabel } from '~/utils/equipment';
import type { Equipment } from '~/types/model/schema';

interface ShopEquipmentCardProps {
  equipment: Equipment & { totalAttributes: number };
  canAfford: boolean;
  onBuy: (equipmentId: number, price: number) => void;
  isBuying: boolean;
}

export default function ShopEquipmentCard({
  equipment,
  canAfford,
  onBuy,
  isBuying,
}: ShopEquipmentCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col">
          <CardHeader>
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {equipment.name}
              </h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-2xs font-medium ${getRarityColor(equipment.rarity)}`}
              >
                {getRarityLabel(equipment.rarity)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Level {equipment.min_level}</span>
              <span className="capitalize">{equipment.type}</span>
            </div>
          </CardHeader>

          <CardBody>
            <div className="space-y-2 text-sm">
              {equipment.health_bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Health:
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    +{equipment.health_bonus}
                  </span>
                </div>
              )}
              {equipment.attack_bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Attack:
                  </span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    +{equipment.attack_bonus}
                  </span>
                </div>
              )}
              {equipment.defense_bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Defense:
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    +{equipment.defense_bonus}
                  </span>
                </div>
              )}
              {equipment.speed_bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Speed:
                  </span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    +{equipment.speed_bonus}
                  </span>
                </div>
              )}
              {equipment.critical_bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Critical:
                  </span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    +{equipment.critical_bonus}
                  </span>
                </div>
              )}
            </div>

            {equipment.description && (
              <p className="mt-3 text-sm italic text-gray-500 dark:text-gray-400">
                {equipment.description}
              </p>
            )}
          </CardBody>
        </div>

        <CardFooter>
          <div className="w-full">
            <div className="mb-2 flex items-center justify-center">
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                {equipment.buy_price.toLocaleString()} Gold
              </span>
            </div>
            <Button
              onClick={() => onBuy(equipment.id, equipment.buy_price)}
              disabled={!canAfford || isBuying}
              isLoading={isBuying}
              className="w-full"
              variant={canAfford ? 'primary' : 'secondary'}
            >
              {canAfford ? 'Buy' : 'Not Enough Gold'}
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
