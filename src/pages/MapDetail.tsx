import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '~/components/layout';
import { Button, MonsterDetailCard } from '~/components/ui';
import { DIFFICULTY_COLORS } from '~/constants/colors';
import { MAP } from '~/constants/map';
import { MONSTERS } from '~/constants/monster';
import useCharacterStore from '~/store/character-store';
import type { MapDifficulty } from '~/types/map';
import { useCallback } from 'react';
import BattleLog from '~/components/BattleLog';
import type { Monster } from '~/types/monster';

const MapDetail: React.FC = () => {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const { character } = useCharacterStore();

  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isBattleStart, setIsBattleStart] = useState(false);

  const handleExploration = () => {
    const randomMonster =
      mapMonsters[Math.floor(Math.random() * mapMonsters.length)];
    setSelectedMonster(randomMonster);
    setIsBattleStart(true);
  };

  const map = MAP.find((m) => m.id === Number(mapId));
  const mapMonsters = MONSTERS.filter(
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
              <MonsterDetailCard
                key={monster.id}
                monster={monster}
                className="h-fit"
              />
            ))}
          </div>
        </div>

        {isBattleStart && selectedMonster && (
          <BattleLog character={character} monster={selectedMonster} />
        )}

        {/* Action Section */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-8 py-3 text-lg"
            onClick={handleExploration}
          >
            Start Exploration
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MapDetail;
