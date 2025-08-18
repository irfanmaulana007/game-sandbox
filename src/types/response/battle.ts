import type { BattleLogs, BattleLogDetails, Equipment } from '../model/schema';
import type { MonsterWithDetail } from '../monster';

interface BattleLogWithDetails extends BattleLogs {
  battleLogDetails: BattleLogDetails[];
}

export interface BattleResponse {
  battleLog: BattleLogWithDetails;
  battleResult: 'victory' | 'defeat';
  experienceGained: number;
  goldGained: number;
  levelGained: boolean;
  monster: MonsterWithDetail;
  equipmentDropped?: Equipment;
}
