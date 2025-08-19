import React from 'react';
import { Layout } from '~/components/layout';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import { Navigate } from 'react-router-dom';
import CharacterStatusBar from '~/components/character-status/CharacterStatusBar';
import CharacterStatusRadar from '~/components/character-status/CharacterStatusRadar';
import { useMyCharacter } from '~/services/character-service';
import { useLevelExperience } from '~/services/experience-service';
import { useAttributeAllocation } from '~/hooks/useAttibuteAllocation';
import CharacterInformation from '~/components/character-status/CharacterInformation';
import CharacterEquipment from '~/components/CharacterEquipment';

const Character: React.FC = () => {
  const { data: characterData, isLoading: characterLoading } = useMyCharacter();
  const character = characterData?.data;
  const { data: experienceData, isLoading: experienceLoading } =
    useLevelExperience(character?.experience);
  const experience = experienceData?.data;

  const {
    isAllocating,
    tempStatus,
    tempAvailablePoints,
    startAllocation,
    cancelAllocation,
    allocateStatusPoint,
    applyAllocation,
    resetPoints,
    isLoading: resetStatusPointsPending,
  } = useAttributeAllocation(character);

  if (characterLoading || experienceLoading) {
    return <div>Loading...</div>;
  }

  if (!character) {
    return <Navigate to="/onboarding" />;
  }

  if (experience === undefined) {
    return <div>No experience data</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Character Header */}
        <CharacterInformation character={character} experience={experience} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Character Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Character Stats
                </h2>
                <div className="flex items-center gap-x-2">
                  {!isAllocating && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetPoints}
                      className="text-xs"
                      isLoading={resetStatusPointsPending}
                    >
                      Reset Points
                    </Button>
                  )}

                  {!isAllocating && character.status_points > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startAllocation}
                      className="text-xs"
                    >
                      Allocate Points
                    </Button>
                  )}

                  {isAllocating && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelAllocation}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyAllocation}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Available Status Points
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isAllocating ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {isAllocating
                      ? tempAvailablePoints
                      : character.status_points}
                    {isAllocating && (
                      <span className="ml-2 text-xs text-blue-500">
                        (Allocating...)
                      </span>
                    )}
                  </span>
                </div>
                <CharacterStatusBar
                  status={{
                    health: character.max_health,
                    attack: character.attack,
                    defense: character.defense,
                    speed: character.speed,
                    critical: character.critical,
                  }}
                  isAllocating={isAllocating}
                  tempStatus={tempStatus}
                  tempAvailablePoints={tempAvailablePoints}
                  onAllocatePoint={allocateStatusPoint}
                />
              </div>
            </CardBody>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Status Overview
              </h2>
            </CardHeader>
            <CardBody>
              <div className="h-80">
                <CharacterStatusRadar
                  status={{
                    health: character.max_health,
                    attack: character.attack,
                    defense: character.defense,
                    speed: character.speed,
                    critical: character.critical,
                  }}
                  comparedStatus={tempStatus}
                />
              </div>
            </CardBody>
          </Card>

          <div className="col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Status Overview
                </h2>
              </CardHeader>
              <CardBody>
                <CharacterEquipment />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Character;
