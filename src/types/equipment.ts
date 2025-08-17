import type { CharacterStatus } from './character';

export type EquipmentType = 'weapon' | 'armor' | 'accessory';

export interface Equipment {
  id: number;
  type: EquipmentType;
  minLevel: number;
  status: CharacterStatus;
}
