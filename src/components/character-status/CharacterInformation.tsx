import type { CharacterWithJob } from '~/types/model/character';
import type { LevelExperienceResponse } from '~/types/response/experience';
import { numberFormat } from '~/utils/number';

export default function CharacterInformation({
  character,
  experience,
}: {
  character: CharacterWithJob;
  experience: LevelExperienceResponse;
}) {
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

  return (
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
  );
}
