import { MAX_HEALTH, MAX_STATUS } from '~/constants/characters/job';
import type { CharacterStatus } from '~/types/character';

interface CharacterStatusBarProps {
  status: CharacterStatus;
}

export default function CharacterStatusBar({
  status,
}: CharacterStatusBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <CharacterStatusBarItem
        name="Health"
        value={status.health}
        maxValue={MAX_HEALTH}
      />
      <CharacterStatusBarItem
        name="Attack"
        value={status.attack}
        maxValue={MAX_STATUS}
      />
      <CharacterStatusBarItem
        name="Defense"
        value={status.defense}
        maxValue={MAX_STATUS}
      />
      <CharacterStatusBarItem
        name="Speed"
        value={status.speed}
        maxValue={MAX_STATUS}
      />
      <CharacterStatusBarItem
        name="Critical"
        value={status.critical}
        maxValue={MAX_STATUS}
      />
    </div>
  );
}

interface CharacterStatusBarItemProps {
  name: string;
  value: number;
  maxValue: number;
}
export const CharacterStatusBarItem = ({
  name,
  value,
  maxValue,
}: CharacterStatusBarItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>
      </div>
      <div className="flex w-1/2 items-center gap-2">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full bg-blue-500`}
            style={{
              width: `${(value / maxValue) * 100}%`,
            }}
          ></div>
        </div>
        <span className="min-w-[2rem] text-right font-mono text-xs text-gray-600 dark:text-gray-400">
          {value}
        </span>
      </div>
    </div>
  );
};
