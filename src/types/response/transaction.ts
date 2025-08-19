import type { TransactionType } from '../model/schema';

export interface TransactionResponse {
  id: string;
  characterId: string;
  equipmentId: number;
  type: TransactionType;
  quantity: number;
  price: number;
  totalAmount: number;
  createdAt: Date;
  equipment: {
    id: number;
    name: string;
    type: string;
    rarity: string;
  };
}
