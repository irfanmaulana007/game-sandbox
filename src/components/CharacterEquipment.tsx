import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import {
  useEquippedItems,
  characterEquippedItemService,
} from '~/services/character-equipped-item-service';
import { useMyCharacter } from '~/services/character-service';
import { queryKeys } from '~/constants/instance';
import type { EquipmentSlot, Equipment } from '~/types/model/schema';
import type { EquipmentType } from '~/types/equipment';
import { useCharacterEquipment } from '~/services/character-equipment';

interface EquipmentSlotProps {
  slot: EquipmentSlot;
  equipment?: Equipment;
  onUnequip: (slot: EquipmentSlot) => void;
  isSelected: boolean;
  onSelect: (slot: EquipmentSlot) => void;
}

const EquipmentSlot: React.FC<EquipmentSlotProps> = ({
  slot,
  equipment,
  onUnequip,
  isSelected,
  onSelect,
}) => {
  const slotLabels = {
    weapon: 'Weapon',
    armor: 'Armor',
    accessory_1: 'Accessory 1',
    accessory_2: 'Accessory 2',
  };

  const slotIcons = {
    weapon: '⚔️',
    armor: '🛡️',
    accessory_1: '💍',
    accessory_2: '💍',
  };

  return (
    <div
      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
      }`}
      onClick={() => onSelect(slot)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{slotIcons[slot]}</span>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {slotLabels[slot]}
            </h3>
            {equipment ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="font-medium">{equipment.name}</div>
                <div className="text-xs">
                  Lv.{equipment.min_level} • {equipment.rarity}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Empty slot
              </div>
            )}
          </div>
        </div>
        {equipment && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUnequip(slot);
            }}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Unequip
          </Button>
        )}
      </div>
      {equipment && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="grid grid-cols-2 gap-1">
            {equipment.health_bonus > 0 && (
              <span>HP +{equipment.health_bonus}</span>
            )}
            {equipment.attack_bonus > 0 && (
              <span>ATK +{equipment.attack_bonus}</span>
            )}
            {equipment.defense_bonus > 0 && (
              <span>DEF +{equipment.defense_bonus}</span>
            )}
            {equipment.speed_bonus > 0 && (
              <span>SPD +{equipment.speed_bonus}</span>
            )}
            {equipment.critical_bonus > 0 && (
              <span>CRIT +{equipment.critical_bonus}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface EquipmentItemProps {
  equipment: Equipment;
  onEquip: (equipment: Equipment, slot: EquipmentSlot) => void;
  isEquipped: boolean;
  characterLevel: number;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({
  equipment,
  onEquip,
  isEquipped,
  characterLevel,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);

  const getValidSlots = (type: EquipmentType): EquipmentSlot[] => {
    switch (type) {
      case 'weapon':
        return ['weapon'];
      case 'armor':
        return ['armor'];
      case 'accessory':
        return ['accessory_1', 'accessory_2'];
      default:
        return [];
    }
  };

  const validSlots = getValidSlots(equipment.type);

  const handleEquip = () => {
    if (validSlots.length === 1) {
      onEquip(equipment, validSlots[0]);
    } else {
      setSelectedSlot(validSlots[0]);
    }
  };

  const rarityColors = {
    common: 'border-gray-300 bg-gray-50 dark:bg-gray-800',
    uncommon: 'border-green-300 bg-green-50 dark:bg-green-900/20',
    rare: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
    epic: 'border-purple-300 bg-purple-50 dark:bg-purple-900/20',
    legendary: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        isEquipped
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : rarityColors[equipment.rarity]
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {equipment.name}
            </h3>
            <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {equipment.type}
            </span>
            <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {equipment.rarity}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Lv.{equipment.min_level} •{' '}
            {equipment.description || 'No description'}
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="grid grid-cols-2 gap-1">
              {equipment.health_bonus > 0 && (
                <span>HP +{equipment.health_bonus}</span>
              )}
              {equipment.attack_bonus > 0 && (
                <span>ATK +{equipment.attack_bonus}</span>
              )}
              {equipment.defense_bonus > 0 && (
                <span>DEF +{equipment.defense_bonus}</span>
              )}
              {equipment.speed_bonus > 0 && (
                <span>SPD +{equipment.speed_bonus}</span>
              )}
              {equipment.critical_bonus > 0 && (
                <span>CRIT +{equipment.critical_bonus}</span>
              )}
            </div>
          </div>
        </div>
        <div className="ml-4">
          {isEquipped ? (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Equipped
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleEquip}
              disabled={validSlots.length === 0 || characterLevel < equipment.min_level}
            >
              Equip
            </Button>
          )}
        </div>
      </div>

      {selectedSlot && (
        <div className="mt-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
          <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
            Select slot to equip:
          </div>
          <div className="flex space-x-2">
            {validSlots.map((slot) => (
              <Button
                key={slot}
                variant="outline"
                size="sm"
                onClick={() => {
                  onEquip(equipment, slot);
                  setSelectedSlot(null);
                }}
              >
                {slot === 'weapon'
                  ? 'Weapon'
                  : slot === 'armor'
                    ? 'Armor'
                    : slot === 'accessory_1'
                      ? 'Accessory 1'
                      : 'Accessory 2'}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSlot(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CharacterEquipment() {
  const { data: characterData } = useMyCharacter();
  const characterId = characterData?.data?.id;

  const { data: equippedData } = useEquippedItems(characterId || '');
  const { data: equipmentData } = useCharacterEquipment(characterId || '');

  const queryClient = useQueryClient();

  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [selectedType, setSelectedType] = useState<EquipmentType | 'all'>(
    'all'
  );

  // Create equipped equipment map by slot
  const equippedEquipment = useMemo(() => {
    const map = new Map<EquipmentSlot, Equipment>();
    if (equippedData?.data) {
      // Since the new service returns Equipment[], we need to determine which slot each equipment is in
      // For now, we'll assume the first equipment of each type goes to the appropriate slot
      const weapons = equippedData.data.filter((eq) => eq.slot === 'weapon');
      const armors = equippedData.data.filter((eq) => eq.slot === 'armor');
      const accessories = equippedData.data.filter(
        (eq) => eq.slot === 'accessory_1'
      );
      const accessories2 = equippedData.data.filter(
        (eq) => eq.slot === 'accessory_2'
      );

      if (weapons.length > 0) map.set('weapon', weapons[0].equipment);
      if (armors.length > 0) map.set('armor', armors[0].equipment);
      if (accessories.length > 0)
        map.set('accessory_1', accessories[0].equipment);
      if (accessories2.length > 0)
        map.set('accessory_2', accessories2[0].equipment);
    }
    return map;
  }, [equippedData]);

  // Filter equipment by type and level
  const availableEquipment = useMemo(() => {
    if (!equipmentData?.data) return [];

    const equipments = equipmentData.data;

    const distinctEquipments = equipments.filter(
      (equipment, index, self) =>
        index ===
        self.findIndex((t) => t.equipment.id === equipment.equipment.id)
    );

    // First filter by type if not 'all'
    let filteredEquipments = distinctEquipments;
    if (selectedType !== 'all') {
      filteredEquipments = distinctEquipments.filter(
        (equipment) => equipment.equipment.type === selectedType
      );
    }

    // Then sort by total status
    const sortedEquipmentsByTotalStatus = filteredEquipments.sort((a, b) => {
      const aTotalStatus =
        a.equipment.health_bonus / 10 +
        a.equipment.attack_bonus +
        a.equipment.defense_bonus +
        a.equipment.speed_bonus +
        a.equipment.critical_bonus;
      const bTotalStatus =
        b.equipment.health_bonus / 10 +
        b.equipment.attack_bonus +
        b.equipment.defense_bonus +
        b.equipment.speed_bonus +
        b.equipment.critical_bonus;
      return bTotalStatus - aTotalStatus;
    });

    return sortedEquipmentsByTotalStatus;
  }, [equipmentData, selectedType]);

  // Check if equipment is equipped
  const isEquipmentEquipped = (equipmentId: number) => {
    return (
      equippedData?.data?.some(
        (equipment) => equipment.equipment.id === equipmentId
      ) || false
    );
  };

  // Equip mutation
  const equipMutation = useMutation({
    mutationFn: async ({
      equipmentId,
      slot,
    }: {
      equipmentId: number;
      slot: EquipmentSlot;
    }) => {
      // Check if the slot already has an item
      const slotHasItem = equippedEquipment.has(slot);

      if (slotHasItem) {
        // Use swap mutation if slot is occupied
        return characterEquippedItemService.swapEquipment(
          characterId || '',
          equipmentId,
          slot
        );
      } else {
        // Use equip mutation if slot is empty
        return characterEquippedItemService.equipToSlot(
          characterId || '',
          equipmentId,
          slot
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.characterEquippedItems.all(characterId || ''),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
    },
  });

  // Unequip mutation
  const unequipMutation = useMutation({
    mutationFn: async (slot: EquipmentSlot) => {
      return characterEquippedItemService.unEquipBySlot(
        characterId || '',
        slot
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.characterEquippedItems.all(characterId || ''),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
    },
  });

  const handleEquip = (equipment: Equipment, slot: EquipmentSlot) => {
    if (characterId) {
      equipMutation.mutate({ equipmentId: equipment.id, slot });
    }
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    unequipMutation.mutate(slot);
  };

  if (!characterId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          No character selected
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Equipment Slots */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Equipment Slots
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <EquipmentSlot
              slot="weapon"
              equipment={equippedEquipment.get('weapon')}
              onUnequip={handleUnequip}
              isSelected={selectedSlot === 'weapon'}
              onSelect={setSelectedSlot}
            />
            <EquipmentSlot
              slot="armor"
              equipment={equippedEquipment.get('armor')}
              onUnequip={handleUnequip}
              isSelected={selectedSlot === 'armor'}
              onSelect={setSelectedSlot}
            />
            <EquipmentSlot
              slot="accessory_1"
              equipment={equippedEquipment.get('accessory_1')}
              onUnequip={handleUnequip}
              isSelected={selectedSlot === 'accessory_1'}
              onSelect={setSelectedSlot}
            />
            <EquipmentSlot
              slot="accessory_2"
              equipment={equippedEquipment.get('accessory_2')}
              onUnequip={handleUnequip}
              isSelected={selectedSlot === 'accessory_2'}
              onSelect={setSelectedSlot}
            />
          </div>
        </CardBody>
      </Card>

      {/* Available Equipment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Available Equipment
            </h2>
            <div className="flex space-x-2">
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as EquipmentType | 'all')
                }
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Types</option>
                <option value="weapon">Weapons</option>
                <option value="armor">Armor</option>
                <option value="accessory">Accessories</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="max-h-[600px] space-y-3 overflow-y-auto">
            {availableEquipment.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No equipment available
              </div>
            ) : (
              availableEquipment.map((equipment) => (
                <EquipmentItem
                  key={equipment.equipment.id}
                  equipment={equipment.equipment}
                  onEquip={handleEquip}
                  isEquipped={isEquipmentEquipped(equipment.equipment.id)}
                  characterLevel={characterData?.data?.level || 1}
                />
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
