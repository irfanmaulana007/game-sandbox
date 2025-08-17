import { useState, useMemo } from 'react';
import EquipmentCard from '~/components/EquipmentCard';
import { Layout } from '~/components/layout';
import { Card, CardHeader, CardBody } from '~/components/ui';
import { EQUIPMENT_DATA } from '~/constants/equipment';
import { EQUIPMENT_ITEMS } from '~/constants/items';
import type { Equipment, EquipmentType } from '~/types/equipment';
import type { ItemRarity } from '~/types/item';

// Filter Component
interface FilterProps {
  selectedType: EquipmentType | 'all';
  selectedRarity: ItemRarity | 'all';
  selectedLevel: number | 'all';
  onTypeChange: (type: EquipmentType | 'all') => void;
  onRarityChange: (rarity: ItemRarity | 'all') => void;
  onLevelChange: (level: number | 'all') => void;
}

const Filter: React.FC<FilterProps> = ({
  selectedType,
  selectedRarity,
  selectedLevel,
  onTypeChange,
  onRarityChange,
  onLevelChange,
}) => {
  const types: (EquipmentType | 'all')[] = [
    'all',
    'weapon',
    'armor',
    'accessory',
  ];
  const rarities: (ItemRarity | 'all')[] = [
    'all',
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
  ];
  const levels = ['all', 1, 5, 10, 15, 20, 25, 30];

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Type Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Equipment Type
            </label>
            <select
              value={selectedType}
              onChange={(e) =>
                onTypeChange(e.target.value as EquipmentType | 'all')
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === 'all'
                    ? 'All Types'
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rarity
            </label>
            <select
              value={selectedRarity}
              onChange={(e) =>
                onRarityChange(e.target.value as ItemRarity | 'all')
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all'
                    ? 'All Rarities'
                    : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Minimum Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) =>
                onLevelChange(
                  e.target.value === 'all' ? 'all' : Number(e.target.value)
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : `Level ${level}+`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Stats Component
interface StatsProps {
  totalEquipment: number;
  filteredEquipment: number;
  selectedType: EquipmentType | 'all';
  selectedRarity: ItemRarity | 'all';
  selectedLevel: number | 'all';
}

const Stats: React.FC<StatsProps> = ({
  totalEquipment,
  filteredEquipment,
  selectedType,
  selectedRarity,
  selectedLevel,
}) => {
  const getTypeIcon = (type: EquipmentType | 'all') => {
    if (type === 'all') return '📦';
    const icons = {
      weapon: '⚔️',
      armor: '🛡️',
      accessory: '💍',
    };
    return icons[type];
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardBody className="text-center">
          <div className="mb-2 text-2xl">📦</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalEquipment}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Equipment
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="text-center">
          <div className="mb-2 text-2xl">{getTypeIcon(selectedType)}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {filteredEquipment}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Filtered Results
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="text-center">
          <div className="mb-2 text-2xl">⭐</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedRarity === 'all'
              ? 'All'
              : selectedRarity.charAt(0).toUpperCase() +
                selectedRarity.slice(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rarity</div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="text-center">
          <div className="mb-2 text-2xl">📊</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedLevel === 'all' ? 'All' : `Lv.${selectedLevel}+`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
        </CardBody>
      </Card>
    </div>
  );
};

export default function Equipment() {
  const [selectedType, setSelectedType] = useState<EquipmentType | 'all'>(
    'all'
  );
  const [selectedRarity, setSelectedRarity] = useState<ItemRarity | 'all'>(
    'all'
  );
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');

  // Create a combined data structure for filtering
  const equipmentWithItems = useMemo(() => {
    return EQUIPMENT_DATA.map((equipment) => {
      const item = EQUIPMENT_ITEMS.find(
        (item) => item.parentId === equipment.id
      );
      return {
        equipment,
        item: item || null,
      };
    });
  }, []);

  const filteredEquipment = useMemo(() => {
    return equipmentWithItems.filter(({ equipment, item }) => {
      if (!item) return false;

      const typeMatch =
        selectedType === 'all' || equipment.type === selectedType;
      const rarityMatch =
        selectedRarity === 'all' || item.rarity === selectedRarity;
      const levelMatch =
        selectedLevel === 'all' || equipment.minLevel >= selectedLevel;

      return typeMatch && rarityMatch && levelMatch;
    });
  }, [equipmentWithItems, selectedType, selectedRarity, selectedLevel]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Equipment Database
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and explore all available equipment in the game. Filter by
            type, rarity, and level requirements.
          </p>
        </div>

        <Stats
          totalEquipment={EQUIPMENT_DATA.length}
          filteredEquipment={filteredEquipment.length}
          selectedType={selectedType}
          selectedRarity={selectedRarity}
          selectedLevel={selectedLevel}
        />

        <Filter
          selectedType={selectedType}
          selectedRarity={selectedRarity}
          selectedLevel={selectedLevel}
          onTypeChange={setSelectedType}
          onRarityChange={setSelectedRarity}
          onLevelChange={setSelectedLevel}
        />

        {filteredEquipment.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                No equipment found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters to see more results.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEquipment.map(({ equipment, item }) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                item={item!}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
