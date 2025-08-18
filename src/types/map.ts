import type { MapZones, Maps } from './model/schema';
import type { MonsterDetail } from './monster';

export interface MapZoneDetail extends MapZones {
  map: Maps;
  monsters_details: MonsterDetail[];
}
