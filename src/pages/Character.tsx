import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import JOB_LIST from '../constants/characters/job';

const Character: React.FC = () => {
  // Transform job status data for radar chart
  const transformStatusForRadar = (status: { HEALTH: number; ATTACK: number; DEFENSE: number; SPEED: number; CRITICAL: number }) => {
    return Object.entries(status).map(([key, value]) => ({
      subject: key,
      A: key === 'HEALTH' ? (value as number) / 10 : value as number,
      fullMark: 20, // Max value for the radar chart
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Character Jobs</h1>
      
      <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
        {JOB_LIST.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
              {job.name}
            </h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={transformStatusForRadar(job.status)} style={{ pointerEvents: 'none' }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 20]} 
                    tick={false}
                  />
                  <Radar
                    name={job.name}
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(job.status).map(([stat, value]) => (
                <div key={stat} className="flex justify-between">
                  <span className="text-gray-600">{stat}:</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Character;
