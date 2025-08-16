import { useEffect } from 'react';
import { useBattle } from '~/hooks';
import type { Character } from '~/store/character-store';
import type { Monster } from '~/types/monster';

interface BattleLogProps {
  character: Character;
  monster: Monster;
}

export default function BattleLog({ character, monster }: BattleLogProps) {
  const { battleLog, handleStartBattle } = useBattle({ character, monster });
  
  useEffect(() => {
    handleStartBattle();
  }, [handleStartBattle]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Battle Log</div>
      {battleLog.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
}
