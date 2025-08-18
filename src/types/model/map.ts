import type { Maps, MapZones } from './schema';

export interface MapWithZone extends Maps {
  map_zones: MapZones[];
}
