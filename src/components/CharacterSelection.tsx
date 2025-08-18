import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { classNames } from '~/utils';
import type { JobClasses } from '~/types/model/schema';
import { useJobs } from '~/services/job-service';
import type { CharacterStatus } from '~/types/character';

export default function CharacterSelection({
  selectedJob,
  onSelectJob,
}: {
  selectedJob: JobClasses | null;
  onSelectJob: (job: JobClasses) => void;
}) {
  const { data: jobsData } = useJobs();
  const jobs = jobsData?.data || [];

  const getJobStatus = (
    job: JobClasses
  ): { base: CharacterStatus; bonus: CharacterStatus } => {
    return {
      base: {
        health: job.base_health,
        attack: job.base_attack,
        defense: job.base_defense,
        speed: job.base_speed,
        critical: job.base_critical,
      },
      bonus: {
        health: job.health_per_level,
        attack: job.attack_per_level,
        defense: job.defense_per_level,
        speed: job.speed_per_level,
        critical: job.critical_per_level,
      },
    };
  };

  const transformStatusForRadar = (job: JobClasses) => {
    const jobStatus = getJobStatus(job);
    return Object.entries(jobStatus.base).map(([key, value]) => ({
      subject: key,
      A: key === 'health' ? (value as number) / 10 : (value as number),
      fullMark: 20,
    }));
  };

  const getJobIcon = (jobName: string) => {
    const icons = {
      Barbarian: '⚔️',
      Swordsman: '🗡️',
      Archer: '🏹',
      Ninja: '🥷',
    };
    return icons[jobName as keyof typeof icons] || '👤';
  };

  const getJobDescription = (jobName: string) => {
    const descriptions = {
      Barbarian: 'High defense and attack power',
      Swordsman: 'Balanced fighter',
      Archer: 'Ranged specialist',
      Ninja: 'Stealthy assassin',
    };
    return (
      descriptions[jobName as keyof typeof descriptions] || 'Skilled warrior'
    );
  };

  const getStatusColor = (statName: string) => {
    const colors = {
      health: 'text-red-500',
      attack: 'text-orange-500',
      defense: 'text-blue-500',
      speed: 'text-green-500',
      critical: 'text-purple-500',
    };
    return colors[statName as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={classNames(
            'cursor-pointer rounded-xl border-2 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800',
            selectedJob?.id === job.id
              ? 'border-blue-500 shadow-blue-100 dark:border-blue-500 dark:shadow-blue-900/20'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          )}
          onClick={() => onSelectJob(job)}
        >
          {/* Job Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="text-4xl">{getJobIcon(job.name)}</div>
            <div className="flex-1">
              <h2 className="mb-1 text-xl font-bold text-gray-800 dark:text-white">
                {job.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getJobDescription(job.name)}
              </p>
            </div>
            <div
              className={classNames(
                'flex h-6 w-6 items-center justify-center rounded-full bg-blue-500',
                selectedJob?.id === job.id ? 'visible' : 'invisible'
              )}
            >
              <svg
                className="h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="mb-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={transformStatusForRadar(job)}
                style={{ pointerEvents: 'none' }}
              >
                <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 20]} tick={false} />
                <Radar
                  name={job.name}
                  dataKey="A"
                  stroke={selectedJob?.id === job.id ? '#3b82f6' : '#6b7280'}
                  fill={selectedJob?.id === job.id ? '#3b82f6' : '#6b7280'}
                  fillOpacity={selectedJob?.id === job.id ? 0.3 : 0.1}
                  strokeWidth={selectedJob?.id === job.id ? 2 : 1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(getJobStatus(job).base).map(([statName, value]) => {
              const bonus =
                getJobStatus(job).bonus[statName as keyof CharacterStatus];
              return (
                <div key={statName} className="text-center">
                  <div
                    className={`text-xs font-medium ${getStatusColor(statName)}`}
                  >
                    {statName}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-sm font-bold text-gray-800 dark:text-white">
                      {value}
                    </div>
                    <div className="text-2xs text-gray-500 dark:text-gray-400">
                      + {bonus}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
