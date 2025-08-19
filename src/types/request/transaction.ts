export interface BuyEquipmentRequest {
  characterId: string;
  equipmentId: number;
  quantity?: number;
}

export interface SellEquipmentRequest {
  characterId: string;
  equipmentId: number;
  quantity?: number;
}
