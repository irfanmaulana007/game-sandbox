import type { Equipment } from './equipment';

export type ItemType = 'equipment' | 'enhancement' | 'potion';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
interface ItemPrice {
  buy: number;
  sell: number;
}

export interface Item {
  id: number;
  type: ItemType;
  parentId: Equipment['id'];
  name: string;
  description: string;
  rarity: ItemRarity;
  price: ItemPrice;
  dropRate: number;
}
