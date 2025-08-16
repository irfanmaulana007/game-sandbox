import type { CharacterJob } from '~/types/character';
export const MAX_HEALTH = 999;
export const MAX_STATUS = 99;

const JOB_LIST: CharacterJob[] = [
  {
    id: 1,
    name: 'Barbarian',
    baseStatus: {
      health: 100,
      attack: 12,
      defense: 17,
      speed: 6,
      critical: 5,
    },
  },
  {
    id: 2,
    name: 'Swordsman',
    baseStatus: {
      health: 100,
      attack: 11,
      defense: 13,
      speed: 8,
      critical: 8,
    },
  },
  {
    id: 3,
    name: 'Archer',
    baseStatus: {
      health: 100,
      attack: 11,
      defense: 9,
      speed: 12,
      critical: 8,
    },
  },
  {
    id: 4,
    name: 'Ninja',
    baseStatus: {
      health: 100,
      attack: 8,
      defense: 4,
      speed: 17,
      critical: 11,
    },
  },
];

export default JOB_LIST;
