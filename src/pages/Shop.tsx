import { useState, useMemo } from 'react';
import { Layout } from '~/components/layout';
import { ShopFilters, ShopEquipmentCard, CharacterGoldDisplay } from '~/components';
import { useEquipment } from '~/services/equipment-service';
import { useMyCharacter } from '~/services/character-service';
import { useBuyEquipment } from '~/services/transaction-service';
import { useToast } from '~/hooks/useToast';
import { calculateTotalAttributes } from '~/utils/equipment';
import type { EquipmentType, Rarity } from '~/types/model/schema';

type SortOption = 'total_attributes_high' | 'total_attributes_low' | 'price_high' | 'price_low';

export default function ShopPage() {
  const toast = useToast();
  const { data: characterData } = useMyCharacter();

  // Filter states
  const [selectedType, setSelectedType] = useState<EquipmentType | undefined>(undefined);
  const [selectedRarity, setSelectedRarity] = useState<Rarity | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>('price_low');

  // Equipment data
  const { data: equipmentData, isLoading } = useEquipment(
    selectedType,
    selectedRarity,
    selectedLevel
  );

  const character = characterData?.data;
  const buyEquipmentMutation = useBuyEquipment(character?.id);
  const equipment = equipmentData?.data || [];

  // Calculate total attributes for sorting
  const equipmentWithTotalAttributes = useMemo(() => {
    return equipment.map(item => ({
      ...item,
      totalAttributes: calculateTotalAttributes(item)
    }));
  }, [equipment]);

  // Sort equipment
  const sortedEquipment = useMemo(() => {
    const sorted = [...equipmentWithTotalAttributes];
    
    switch (sortBy) {
      case 'total_attributes_high':
        return sorted.sort((a, b) => b.totalAttributes - a.totalAttributes);
      case 'total_attributes_low':
        return sorted.sort((a, b) => a.totalAttributes - b.totalAttributes);
      case 'price_high':
        return sorted.sort((a, b) => b.buy_price - a.buy_price);
      case 'price_low':
        return sorted.sort((a, b) => a.buy_price - b.buy_price);
      default:
        return sorted;
    }
  }, [equipmentWithTotalAttributes, sortBy]);

  const handleBuyEquipment = async (equipmentId: number, price: number) => {
    if (!character) {
      toast.error('Character not found');
      return;
    }

    if (character.gold < price) {
      toast.error('Not enough gold to purchase this item');
      return;
    }

    try {
      await buyEquipmentMutation.mutateAsync({
        characterId: character.id,
        equipmentId,
        quantity: 1,
      });
      toast.success('Equipment purchased successfully!');
    } catch {
      toast.error('Failed to purchase equipment');
    }
  };

  const canAfford = (price: number) => {
    return character ? character.gold >= price : false;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with Character Gold */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shop</h1>
          {character && <CharacterGoldDisplay gold={character.gold} />}
        </div>

        {/* Filters and Sorting */}
        <ShopFilters
          selectedType={selectedType}
          selectedRarity={selectedRarity}
          selectedLevel={selectedLevel}
          sortBy={sortBy}
          onTypeChange={setSelectedType}
          onRarityChange={setSelectedRarity}
          onLevelChange={setSelectedLevel}
          onSortChange={setSortBy}
        />

        {/* Equipment Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedEquipment.map((item) => (
              <ShopEquipmentCard
                key={item.id}
                equipment={item}
                canAfford={canAfford(item.buy_price)}
                onBuy={handleBuyEquipment}
                isBuying={buyEquipmentMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && sortedEquipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No equipment found with the selected filters.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
