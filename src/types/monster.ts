import type { CharacterStatus } from './character';
import type { Map } from './map';

export interface MonsterStatus extends CharacterStatus {
  id: number;
  mapId: Map['id'];
  name: string;
  description: string;
  level: number;
  experience: number;
  gold: number;
}
