import type { MonsterDetails, Monsters } from './model/schema';

export interface MonsterDetail extends MonsterDetails {
  monsters: Monsters[];
}

export interface MonsterWithDetail extends Monsters {
  monster_detail: MonsterDetail;
}
