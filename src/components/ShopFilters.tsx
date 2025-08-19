import { Card, CardHeader, CardBody } from './ui/Card';
import type { EquipmentType, Rarity } from '~/types/model/schema';

type SortOption = 'total_attributes_high' | 'total_attributes_low' | 'price_high' | 'price_low';

const EQUIPMENT_TYPES: { value: EquipmentType; label: string }[] = [
  { value: 'weapon', label: 'Weapon' },
  { value: 'armor', label: 'Armor' },
  { value: 'accessory', label: 'Accessory' },
];

const RARITIES: { value: Rarity; label: string }[] = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
];

const LEVELS = [1, 5, 10, 15, 20, 25, 30, 35, 40];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'total_attributes_high', label: 'Highest Total Attributes' },
  { value: 'total_attributes_low', label: 'Lowest Total Attributes' },
  { value: 'price_high', label: 'Highest Price' },
  { value: 'price_low', label: 'Lowest Price' },
];

interface ShopFiltersProps {
  selectedType: EquipmentType | undefined;
  selectedRarity: Rarity | undefined;
  selectedLevel: number | undefined;
  sortBy: SortOption;
  onTypeChange: (type: EquipmentType | undefined) => void;
  onRarityChange: (rarity: Rarity | undefined) => void;
  onLevelChange: (level: number | undefined) => void;
  onSortChange: (sort: SortOption) => void;
}

export default function ShopFilters({
  selectedType,
  selectedRarity,
  selectedLevel,
  sortBy,
  onTypeChange,
  onRarityChange,
  onLevelChange,
  onSortChange,
}: ShopFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters & Sorting</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Equipment Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment Type
            </label>
            <select
              value={selectedType || ''}
              onChange={(e) => onTypeChange(e.target.value as EquipmentType || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Types</option>
              {EQUIPMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rarity
            </label>
            <select
              value={selectedRarity || ''}
              onChange={(e) => onRarityChange(e.target.value as Rarity || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Rarities</option>
              {RARITIES.map((rarity) => (
                <option key={rarity.value} value={rarity.value}>
                  {rarity.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Level
            </label>
            <select
              value={selectedLevel || ''}
              onChange={(e) => onLevelChange(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Levels</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
