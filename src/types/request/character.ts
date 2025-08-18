export interface CreateCharacterRequest {
  name: string;
  job_id: number;
}

export interface AllocateStatusPointsRequest {
  health_points: number;
  attack_points: number;
  defense_points: number;
  speed_points: number;
  critical_points: number;
}