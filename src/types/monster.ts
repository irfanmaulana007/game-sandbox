import type { CharacterStatus } from './character';
import type { Map } from './map';

// Base monster model - displayed on map detail page
export interface Monster {
  id: number;
  mapId: Map['id'];
  name: string;
  description: string;
}

// Monster detail model - contains rank-specific information
export interface MonsterDetail {
  id: number;
  monsterId: Monster['id'];
  rank: 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  level: number;
  experience: number;
  gold: number;
  status: CharacterStatus;
}

// Monster with ranges for display purposes
export interface MonsterWithRanges extends Monster {
  rankRanges: {
    level: { min: number; max: number };
    experience: { min: number; max: number };
    gold: { min: number; max: number };
    status: {
      health: { min: number; max: number };
      attack: { min: number; max: number };
      defense: { min: number; max: number };
      speed: { min: number; max: number };
      critical: { min: number; max: number };
    };
  };
}

// Battle monster interface that combines base monster with status
export interface BattleMonster extends Monster, MonsterDetail {}
