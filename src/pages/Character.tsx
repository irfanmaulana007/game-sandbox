import React from 'react';
import { Layout } from '~/components/layout';

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
      fullMark: 20, // Max value for the radar chart
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          {character.name}
        </h1>

        <div className="flex items-center gap-x-4">
          <div className="flex-1">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">job</span>
                <span className="text-sm text-gray-500">
                  {character.job.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">job</span>
                <span className="text-sm text-gray-500">{character.level}</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={transformStatusForRadar(character.job.status)}
                style={{ pointerEvents: 'none' }}
              >
                <PolarGrid stroke="#e5e7eb" />
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
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Character;
