import React from 'react';
import { Layout } from '~/components/layout';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import { Navigate } from 'react-router-dom';
import CharacterStatusBar from '~/components/character-status/CharacterStatusBar';
import CharacterStatusRadar from '~/components/character-status/CharacterStatusRadar';
import { numberFormat } from '~/utils/number';
import { useMyCharacter } from '~/services/character-service';
import { useLevelExperience } from '~/services/experience-service';
import { useAttributeAllocation } from '~/hooks/useAttibuteAllocation';

const Character: React.FC = () => {
  const { data: characterData, isLoading: characterLoading } = useMyCharacter();
  const character = characterData?.data;
  console.log('🚀 ~ Character ~ character:', character);
  const { data: experienceData, isLoading: experienceLoading } =
    useLevelExperience(character?.experience);
  const experience = experienceData?.data;
  console.log('🚀 ~ Character ~ experience:', experience);

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

  const getJobIcon = (jobName: string) => {
    const icons = {
      Warrior: '⚔️',
      Mage: '🔮',
      Archer: '🏹',
      Assassin: '🗡️',
      Tank: '🛡️',
    };
    return icons[jobName as keyof typeof icons] || '👤';
  };

  // const startAllocation = () => {
  //   // startAllocation();
  // };

  // const cancelAllocation = () => {
  //   // cancelAllocation();
  // };

  // const applyAllocation = () => {
  //   // applyAllocation();
  // };

  // const experienceProgress = getExperienceProgress();
  // const displayAvailablePoints = isAllocating
  //   ? tempAvailablePoints
  //   : character.status_points;

  // const isAllocating = false;

  if (experience === undefined) {
    return <div>No experience data</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Character Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="text-6xl">{getJobIcon(character.job.name)}</div>
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">
                {character.name}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {character.job.name}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Level {character.level}
                </span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {numberFormat(character.gold)} Gold
                </span>
              </div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="mx-auto max-w-md">
            <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Experience</span>
              <span>
                {numberFormat(character.experience)} XP
                <>
                  {' '}
                  /{' '}
                  {numberFormat(
                    experience.experienceToNext + experience.currentExperience
                  )}{' '}
                  XP
                </>
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{
                  width: `${experience.progress}%`,
                }}
              ></div>
            </div>
            <div className="mt-1 text-center text-xs text-gray-500">
              {numberFormat(experience.experienceToNext)} XP to next level
            </div>
          </div>
        </div>

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
        </div>
      </div>
    </Layout>
  );
};

export default Character;
