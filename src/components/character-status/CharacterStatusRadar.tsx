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
  comparedStatus?: CharacterStatus | null;
}

export default function CharacterStatusRadar({
  status,
  comparedStatus,
}: CharacterStatusRadarProps) {
  const transformStatusForRadar = (status: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    critical: number;
  }) => {
    const statusData = [];
    for (const [key, value] of Object.entries(status)) {
      statusData.push({
        subject: key,
        A: key === 'health' ? (value as number) / 10 : (value as number),
        B:
          key === 'health'
            ? (comparedStatus?.[key as keyof CharacterStatus] as number) / 10
            : (comparedStatus?.[key as keyof CharacterStatus] as number),
        fullMark: 999,
      });
    }

    return statusData;
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
        <PolarRadiusAxis angle={90} domain={[0, 99]} tick={false} />
        <Radar
          dataKey="A"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        {comparedStatus && (
          <Radar
            dataKey="B"
            stroke="#3b82f699"
            fill="#3b82f699"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}
