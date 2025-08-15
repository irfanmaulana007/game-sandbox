import React from 'react';
import { Layout } from '~/components/layout';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import useCharacterStore from '~/store/character-store';
import { Navigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const Character: React.FC = () => {
  const { character } = useCharacterStore();

  if (!character) {
    return <Navigate to="/onboarding" />;
  }

  const transformStatusForRadar = (status: {
    HEALTH: number;
    ATTACK: number;
    DEFENSE: number;
    SPEED: number;
    CRITICAL: number;
  }) => {
    return Object.entries(status).map(([key, value]) => ({
      subject: key,
      A: key === 'HEALTH' ? (value as number) / 10 : (value as number),
      fullMark: 20,
    }));
  };

  const getStatusColor = (statName: string) => {
    const colors = {
      HEALTH: 'bg-red-500',
      ATTACK: 'bg-orange-500',
      DEFENSE: 'bg-blue-500',
      SPEED: 'bg-green-500',
      CRITICAL: 'bg-purple-500',
    };
    return colors[statName as keyof typeof colors] || 'bg-gray-500';
  };

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

  const experienceToNextLevel = (level: number) => {
    return level * 100; // Simple formula: level * 100 XP needed
  };

  const experienceProgress = (currentExp: number, level: number) => {
    const requiredExp = experienceToNextLevel(level);
    return Math.min((currentExp / requiredExp) * 100, 100);
  };

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
              </div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="mx-auto max-w-md">
            <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Experience</span>
              <span>
                {character.experience} /{' '}
                {experienceToNextLevel(character.level)} XP
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{
                  width: `${experienceProgress(character.experience, character.level)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Character Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Character Stats
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Available Status Points
                  </span>
                  <span className="text-sm text-gray-500">
                    {character.availableStatusPoints}
                  </span>
                </div>
                {Object.entries(character.job.status).map(
                  ([statName, value]) => (
                    <div
                      key={statName}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${getStatusColor(statName)}`}
                        ></div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {statName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(statName).replace('bg-', 'bg-')}`}
                            style={{
                              width: `${(value / (statName === 'HEALTH' ? 100 : 20)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="min-w-[2rem] text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                          {value}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Available Status Points */}
              {character.availableStatusPoints > 0 && (
                <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                        Available Status Points
                      </h3>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">
                        You have {character.availableStatusPoints} points to
                        allocate
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Allocate Points
                    </Button>
                  </div>
                </div>
              )}
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
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={transformStatusForRadar(character.job.status)}
                    style={{ pointerEvents: 'none' }}
                  >
                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 20]} tick={false} />
                    <Radar
                      name={character.job.name}
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Character;
