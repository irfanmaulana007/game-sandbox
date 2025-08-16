import { useEffect, useRef } from 'react';
import { useBattle } from '~/hooks';
import type { Character } from '~/store/character-store';
import type { BattleMonster } from '~/types/monster';

interface BattleLogProps {
  character: Character;
  monster: BattleMonster;
  onReset?: () => void;
  onLevelUp?: (
    character: Character,
    previousLevel: number,
    previousStatus: Character['status']
  ) => void;
}

// Battle monster interface that combines base monster with status

interface BattleLogProps {
  character: Character;
  monster: BattleMonster;
  onReset?: () => void;
}

export default function BattleLog({
  character,
  monster,
  onReset,
  onLevelUp,
}: BattleLogProps) {
  const { battleResult, isBattleInProgress, handleStartBattle, resetBattle } =
    useBattle({
      character,
      monster,
      onLevelUp,
    });

  // Use ref to track if battle has been started to prevent duplicate calls
  const hasStartedBattle = useRef(false);

  // Reset the flag when monster changes
  useEffect(() => {
    hasStartedBattle.current = false;
  }, [monster.id]);

  useEffect(() => {
    // Only start battle once when component mounts
    if (!hasStartedBattle.current && !isBattleInProgress && !battleResult) {
      hasStartedBattle.current = true;
      handleStartBattle();
    }
  }, [handleStartBattle, isBattleInProgress, battleResult]);

  const handleReset = () => {
    hasStartedBattle.current = false; // Reset the flag
    resetBattle();

    // Call the parent's onReset to randomize monster and restart
    if (onReset) {
      onReset();
    } else {
      // Fallback: just restart with same monster
      handleStartBattle();
    }
  };

  if (!battleResult) {
    return (
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing battle...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          Battle Results
        </h3>

        {/* Reset Button */}
        {!isBattleInProgress && (
          <div className="mt-4 text-center">
            <button
              onClick={handleReset}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              New Battle
            </button>
          </div>
        )}
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
              {monster.name} ({monster.rank})
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Winner:
            </span>
            <span
              className={`ml-2 font-bold ${
                battleResult.winner.entity === 'character'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {battleResult.winner.name}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Turns:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {battleResult.turnCount}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Character Health:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {battleResult.finalCharacterHealth}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Monster Health:
            </span>
            <span className="ml-2 font-bold text-gray-800 dark:text-white">
              {battleResult.finalMonsterHealth}
            </span>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="max-h-96 overflow-y-auto rounded-lg bg-gray-900 p-4 font-mono text-sm">
        {battleResult.battleLog.map((log, index) => {
          const isMonsterAttackingLog = log.includes(`${monster.name} attacks`);

          return (
            <div
              key={index}
              className={`mb-1 ${isMonsterAttackingLog ? 'text-red-400' : 'text-green-400'}`}
            >
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}
