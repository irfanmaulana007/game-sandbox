interface Job {
  id: number;
  name: string;
  status: Status;
}

interface Status {
  HEALTH: number;
  ATTACK: number;
  DEFENSE: number;
  SPEED: number;
  CRITICAL: number;
}

const JOB_LIST: Job[] = [
  {
    id: 1,
    name: 'Barbarian',
    status: {
      HEALTH: 100,
      ATTACK: 12,
      DEFENSE: 17,
      SPEED: 6,
      CRITICAL: 5,
    },
  },
  {
    id: 2,
    name: 'Swordsman',
    status: {
      HEALTH: 100,
      ATTACK: 11,
      DEFENSE: 13,
      SPEED: 8,
      CRITICAL: 8,
    },
  },
  {
    id: 3,
    name: 'Archer',
    status: {
      HEALTH: 100,
      ATTACK: 11,
      DEFENSE: 9,
      SPEED: 12,
      CRITICAL: 8,
    },
  },
  {
    id: 4,
    name: 'Ninja',
    status: {
      HEALTH: 100,
      ATTACK: 8,
      DEFENSE: 4,
      SPEED: 17,
      CRITICAL: 11,
    },
  },
];

export default JOB_LIST;
