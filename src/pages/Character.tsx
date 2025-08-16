import React from 'react';
import { Layout } from '~/components/layout';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import useCharacterStore from '~/store/character-store';
import { Navigate } from 'react-router-dom';
import CharacterStatusBar from '~/components/character-status/CharacterStatusBar';
import CharacterStatusRadar from '~/components/character-status/CharacterStatusRadar';
import { useExperience } from '~/hooks/useExperience';

const Character: React.FC = () => {
  const {
    character,
    isAllocating,
    tempStatus,
    tempAvailablePoints,
    startAllocation,
    cancelAllocation,
    allocateStatusPoint,
    applyAllocation,
  } = useCharacterStore();
  const { getExperienceProgress, resetStatusPoints } = useExperience(character);

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

  const resetPoints = () => {
    resetStatusPoints();
  };

  const experienceProgress = getExperienceProgress();
  const displayAvailablePoints = isAllocating
    ? tempAvailablePoints
    : character.availableStatusPoints;

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
                  {character.gold} Gold
                </span>
              </div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="mx-auto max-w-md">
            <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Experience</span>
              <span>
                {character.experience} XP
                {!experienceProgress?.isMaxLevel && experienceProgress && (
                  <>
                    {' '}
                    /{' '}
                    {experienceProgress.experienceNeededForNextLevel +
                      experienceProgress.experienceInCurrentLevel}{' '}
                    XP
                  </>
                )}
                {experienceProgress?.isMaxLevel && ' (Max Level)'}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{
                  width: `${experienceProgress ? experienceProgress.progressPercentage : 0}%`,
                }}
              ></div>
            </div>
            {experienceProgress && !experienceProgress.isMaxLevel && (
              <div className="mt-1 text-center text-xs text-gray-500">
                {experienceProgress.experienceInCurrentLevel} /{' '}
                {experienceProgress.experienceNeededForNextLevel} XP to next
                level
              </div>
            )}
            {experienceProgress?.isMaxLevel && (
              <div className="mt-1 text-center text-xs font-medium text-green-600">
                🎉 Congratulations! You've reached the maximum level!
              </div>
            )}
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
                    >
                      Reset Points
                    </Button>
                  )}

                  {!isAllocating && character.availableStatusPoints > 0 && (
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
                    {displayAvailablePoints}
                    {isAllocating && (
                      <span className="ml-2 text-xs text-blue-500">
                        (Allocating...)
                      </span>
                    )}
                  </span>
                </div>
                <CharacterStatusBar
                  status={character.status}
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
                  status={character.status}
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
