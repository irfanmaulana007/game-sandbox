import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { CharacterStatus } from '~/types/character';

interface CharacterStatusRadarProps {
  status: CharacterStatus;
}

export default function CharacterStatusRadar({
  status,
}: CharacterStatusRadarProps) {
  const transformStatusForRadar = (status: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    critical: number;
  }) => {
    return Object.entries(status).map(([key, value]) => ({
      subject: key,
      A: key === 'health' ? (value as number) / 10 : (value as number),
      fullMark: 20,
    }));
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={transformStatusForRadar(status)}
        style={{ pointerEvents: 'none' }}
      >
        <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 20]} tick={false} />
        <Radar
          // name={status.name}
          dataKey="A"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
