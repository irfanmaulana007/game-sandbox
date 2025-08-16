import { BASE_MONSTERS, MONSTER_DETAILS } from '~/constants/monster';
import type { BattleMonster } from '~/types/monster';

export const useMonster = () => {
  const getRandomMonster = (mapId: number): BattleMonster | undefined => {
    const monsterRanksProbability: Record<string, number> = {
      SS: 0.1,
      S: 0.3,
      A: 0.45,
      B: 0.6,
      C: 0.65,
      D: 0.75,
      E: 0.85,
      F: 1,
    };

    // Get a random base monster for the current map
    const mapBaseMonsters = BASE_MONSTERS.filter(
      (monster) => monster.mapId === Number(mapId)
    );

    if (mapBaseMonsters.length === 0) {
      console.warn('No monsters found for map:', mapId);
      return;
    }

    const randomBaseMonster =
      mapBaseMonsters[Math.floor(Math.random() * mapBaseMonsters.length)];

    // Select a rank based on probability
    const random = Math.random();
    let selectedRank: 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'F'; // Default to lowest rank

    if (random < monsterRanksProbability.SS) {
      selectedRank = 'SS';
    } else if (random < monsterRanksProbability.S) {
      selectedRank = 'S';
    } else if (random < monsterRanksProbability.A) {
      selectedRank = 'A';
    } else if (random < monsterRanksProbability.B) {
      selectedRank = 'B';
    } else if (random < monsterRanksProbability.C) {
      selectedRank = 'C';
    } else if (random < monsterRanksProbability.D) {
      selectedRank = 'D';
    } else if (random < monsterRanksProbability.E) {
      selectedRank = 'E';
    } else {
      selectedRank = 'F';
    }

    // Find the monster detail with the selected rank and base monster ID
    const monsterDetail = MONSTER_DETAILS.find(
      (detail) =>
        detail.monsterId === randomBaseMonster.id &&
        detail.rank === selectedRank
    );

    if (!monsterDetail) {
      console.warn(
        'No monster detail found for:',
        randomBaseMonster.name,
        'rank:',
        selectedRank
      );
      return;
    }

    // Create a battle monster object that combines base info with rank-specific data
    const randomMonster: BattleMonster = {
      ...randomBaseMonster,
      ...monsterDetail,
    };

    console.log('🚀 ~ getRandomMonster ~ randomMonster:', randomMonster);
    return randomMonster;
  };

  return {
    getRandomMonster,
  };
};
