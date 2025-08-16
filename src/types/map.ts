export type MapDifficulty = 'easy' | 'medium' | 'hard' | 'very_hard';

export interface Map {
  id: number;
  name: string;
  description: string;
  minLevel: number;
  recommendedLevel: number;
}
