import type { CharacterWithJob } from '~/types/model/character';
import type { MonsterWithDetail } from '~/types/monster';
import type { BattleResponse } from '~/types/response/battle';

interface BattleLogProps {
  character: CharacterWithJob;
  monster: MonsterWithDetail;
  log: BattleResponse;
}

export default function BattleLog({ character, monster, log }: BattleLogProps) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          Battle Results
        </h3>
      </div>

      {/* Battle Summary */}
      <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Character:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {character.name}
            </span>
          </div>

          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Monster:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {monster.monster_detail.name} ({monster.rank})
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Winner:
            </span>
            <span
              className={`ml-2 font-bold ${
                log.battleResult === 'victory'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {log.battleResult === 'victory'
                ? character.name
                : monster.monster_detail.name}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Turns:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {log.battleLog.turns_taken}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Character Health:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {log.battleLog.character_health_remaining}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Monster Health:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {log.battleLog.monster_health_remaining}
            </span>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="h-[400px] overflow-y-auto rounded-lg bg-gray-900 p-4 font-mono text-sm">
        {log.battleLog.battleLogDetails.map((log, index) => {
          const isDamageReceived = log.type === 'damage_received';

          return (
            <div
              key={index}
              className={`mb-1 ${isDamageReceived ? 'text-red-400' : 'text-green-400'}`}
            >
              {log.message}
            </div>
          );
        })}
      </div>
    </div>
  );
}
