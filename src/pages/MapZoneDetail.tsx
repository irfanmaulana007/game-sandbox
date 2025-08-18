import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BattleLog, LevelUpModal, MonsterCard } from '~/components';
import { Layout } from '~/components/layout';
import { Button } from '~/components/ui';
import { DIFFICULTY_COLORS } from '~/constants/colors';
import { useMyCharacter } from '~/services/character-service';
import { useMapZoneDetail } from '~/services/map-zone-service';
import { useStartBattle } from '~/services/battle-service';
import EquipmentDropModal from '~/components/EquipmentDropModal';

const MapZoneDetail: React.FC = () => {
  const { zoneId, mapId } = useParams<{ zoneId: string; mapId: string }>();
  const navigate = useNavigate();

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState<boolean>(false);
  const [isEquipmentDropModalOpen, setIsEquipmentDropModalOpen] =
    useState<boolean>(false);

  const { data: characterData } = useMyCharacter();
  const character = characterData?.data;

  const { data: zoneData } = useMapZoneDetail(Number(zoneId));
  const zone = zoneData?.data;

  const {
    mutate: startBattle,
    isPending: isStartBattlePending,
    data: battleData,
  } = useStartBattle();
  const battleLog = battleData?.data;

  const mapRecommendedLevel = useMemo(() => {
    if (!zone) return 0;
    return Math.floor((zone.map.min_level + zone.map.max_level) / 2) + 1;
  }, [zone]);

  const handleExploration = () => {
    if (!character) return;
    startBattle({
      characterId: character.id,
      mapZoneId: Number(zoneId),
    });
  };

  useEffect(() => {
    console.log('🚀 ~ MapZoneDetail ~ battleLog:', battleLog);
    if (battleLog?.levelGained) {
      setIsLevelUpModalOpen(true);

      if (battleLog.equipmentDropped) {
        setIsEquipmentDropModalOpen(true);
      }
    }
  }, [battleLog]);

  if (!zone) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Map not found</h1>
            <Button onClick={() => navigate(`/map/${mapId}`)} className="mt-4">
              Back to Maps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Character not found
            </h1>
            <Button onClick={() => navigate(`/map/${mapId}`)} className="mt-4">
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
            onClick={() => navigate(`/map/${mapId}`)}
            className="mb-4"
            variant="outline"
          >
            ← Back to Maps
          </Button>

          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`text-3xl font-bold ${DIFFICULTY_COLORS[zone.map.difficulty]}`}
                >
                  {zone.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {zone.description}
                </p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Min Level:
                    </span>
                    <span
                      className={`text-lg font-bold ${DIFFICULTY_COLORS[zone.map.difficulty]}`}
                    >
                      {zone.map.min_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recommended:
                    </span>
                    <span
                      className={`text-lg font-bold ${DIFFICULTY_COLORS[zone.map.difficulty]}`}
                    >
                      {mapRecommendedLevel}
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
            {zone.monsters_details.map((monster) => (
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
        {isStartBattlePending && (
          <div className="h-80 py-10">
            <div className="flex h-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          </div>
        )}
        {battleLog && (
          <div className="mb-6">
            <BattleLog
              character={character}
              monster={battleLog.monster}
              log={battleLog}
            />
          </div>
        )}

        {/* Action Section */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-8 py-3 text-lg"
            onClick={handleExploration}
            disabled={isStartBattlePending}
          >
            Start Exploration
          </Button>
        </div>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        isVisible={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        character={character}
      />

      <EquipmentDropModal
        isVisible={isEquipmentDropModalOpen}
        onClose={() => setIsEquipmentDropModalOpen(false)}
        equipment={battleLog?.equipmentDropped ?? undefined}
      />
    </Layout>
  );
};

export default MapZoneDetail;
