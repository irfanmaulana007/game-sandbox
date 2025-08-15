import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { CharacterJob } from '~/types/character';
import JOB_LIST from '~/constants/characters/job';
import { classNames } from '~/utils';

export default function CharacterSelection({
  selectedJob,
  onSelectJob,
}: {
  selectedJob: CharacterJob;
  onSelectJob: (job: CharacterJob) => void;
}) {
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
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6">
      {JOB_LIST.map((job) => (
        <div
          key={job.id}
          className={classNames(
            'cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-lg',
            selectedJob.id === job.id && 'border-blue-500'
          )}
          onClick={() => onSelectJob(job)}
        >
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">
            {job.name}
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={transformStatusForRadar(job.status)}
                style={{ pointerEvents: 'none' }}
              >
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 20]} tick={false} />
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
        </div>
      ))}
    </div>
  );
}
