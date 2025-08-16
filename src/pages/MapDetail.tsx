import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '~/components/layout';
import { Button } from '~/components/ui';
import { DIFFICULTY_COLORS } from '~/constants/colors';
import { MAPS } from '~/constants/map';
import { MONSTERS_WITH_RANGES } from '~/constants/monster/index';
import useCharacterStore from '~/store/character-store';
import type { MapDifficulty } from '~/types/map';
import { useCallback } from 'react';
import BattleLog from '~/components/BattleLog';
import type { BattleMonster } from '~/types/monster';
import MonsterCard from '~/components/MonsterCard';
import { useMonster } from '~/hooks/useMonster';

// Battle monster interface that combines base monster with status

const MapDetail: React.FC = () => {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const { character } = useCharacterStore();
  const { getRandomMonster } = useMonster();

  const [selectedMonster, setSelectedMonster] = useState<BattleMonster | null>(
    null
  );
  const [showBattleLog, setShowBattleLog] = useState(false);

  const handleExploration = () => {
    const randomMonster = getRandomMonster(Number(mapId));
    if (randomMonster) {
      setSelectedMonster(randomMonster);
      setShowBattleLog(true);
    }
  };

  const map = MAPS.find((m) => m.id === Number(mapId));
  const mapMonsters = MONSTERS_WITH_RANGES.filter(
    (monster) => monster.mapId === Number(mapId)
  );

  const getDifficulty = useCallback((): MapDifficulty => {
    if (!character || !map) return 'easy';

    if (map.minLevel - character.level <= 0) return 'easy';
    if (map.minLevel - character.level <= 2) return 'medium';
    if (map.minLevel - character.level <= 4) return 'hard';
    return 'very_hard';
  }, [character, map]);

  if (!character) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Character not found
            </h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Maps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!map) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Map not found</h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Maps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            className="mb-4"
            variant="outline"
          >
            ← Back to Maps
          </Button>

          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`text-3xl font-bold ${DIFFICULTY_COLORS[getDifficulty()]}`}
                >
                  {map.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {map.description}
                </p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Min Level:
                    </span>
                    <span
                      className={`text-lg font-bold ${DIFFICULTY_COLORS[getDifficulty()]}`}
                    >
                      {map.minLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recommended:
                    </span>
                    <span
                      className={`text-lg font-bold ${DIFFICULTY_COLORS[getDifficulty()]}`}
                    >
                      {map.recommendedLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monster Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Monsters in this Area
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mapMonsters.map((monster) => (
              <MonsterCard
                key={monster.id}
                monster={monster}
                className="h-fit"
                variant="compact"
              />
            ))}
          </div>
        </div>

        {/* Battle Section */}
        {showBattleLog && selectedMonster && (
          <div className="mb-6">
            <BattleLog
              character={character}
              monster={selectedMonster}
              onReset={handleExploration}
            />
          </div>
        )}

        {/* Action Section */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-8 py-3 text-lg"
            onClick={handleExploration}
            disabled={showBattleLog}
          >
            Start Exploration
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MapDetail;
