export interface CharacterStatus {
  HEALTH: number;
  ATTACK: number;
  DEFENSE: number;
  SPEED: number;
  CRITICAL: number;
}

export interface CharacterJob {
  id: number;
  name: string;
  status: CharacterStatus;
}
