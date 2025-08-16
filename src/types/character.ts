export interface CharacterStatus {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  critical: number;
}

export interface CharacterJob {
  id: number;
  name: string;
  baseStatus: CharacterStatus;
  bonusAttributePerLevel: CharacterStatus;
}
