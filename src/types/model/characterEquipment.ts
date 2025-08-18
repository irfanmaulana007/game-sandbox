import type { CharacterEquipment, Equipment } from './schema';

export interface CharacterEquipmentWithEquipment extends CharacterEquipment {
  equipment: Equipment;
}
