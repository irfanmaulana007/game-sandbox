import type { CharacterEquippedItems, Equipment } from './schema';

export interface EquippedItemWithEquipment extends CharacterEquippedItems {
  equipment: Equipment;
}
