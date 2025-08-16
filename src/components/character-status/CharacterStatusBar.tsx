import { MAX_HEALTH, MAX_STATUS } from '~/constants/characters/job';
import type { CharacterStatus } from '~/types/character';
import Button from '~/components/ui/Button';
import { classNames } from '~/utils';

interface CharacterStatusBarProps {
  status: CharacterStatus;
  isAllocating?: boolean;
  tempStatus?: CharacterStatus | null;
  tempAvailablePoints?: number;
  onAllocatePoint?: (statusKey: keyof CharacterStatus, amount: number) => void;
}

export default function CharacterStatusBar({
  status,
  isAllocating = false,
  tempStatus = null,
  tempAvailablePoints = 0,
  onAllocatePoint,
}: CharacterStatusBarProps) {
  const displayStatus = isAllocating && tempStatus ? tempStatus : status;

  return (
    <div className="flex flex-col gap-2">
      <CharacterStatusBarItem
        name="Health"
        value={displayStatus.health}
        maxValue={MAX_HEALTH}
        isAllocating={isAllocating}
        tempAvailablePoints={tempAvailablePoints}
        onAllocatePoint={
          onAllocatePoint ? () => onAllocatePoint('health', 10) : undefined
        }
        onDeallocatePoint={
          onAllocatePoint ? () => onAllocatePoint('health', -10) : undefined
        }
        canDeallocate={
          isAllocating && tempStatus ? tempStatus.health > status.health : false
        }
        pointRatio={10}
        originalValue={status.health}
      />
      <CharacterStatusBarItem
        name="Attack"
        value={displayStatus.attack}
        maxValue={MAX_STATUS}
        isAllocating={isAllocating}
        tempAvailablePoints={tempAvailablePoints}
        onAllocatePoint={
          onAllocatePoint ? () => onAllocatePoint('attack', 1) : undefined
        }
        onDeallocatePoint={
          onAllocatePoint ? () => onAllocatePoint('attack', -1) : undefined
        }
        canDeallocate={
          isAllocating && tempStatus ? tempStatus.attack > status.attack : false
        }
        originalValue={status.attack}
      />
      <CharacterStatusBarItem
        name="Defense"
        value={displayStatus.defense}
        maxValue={MAX_STATUS}
        isAllocating={isAllocating}
        tempAvailablePoints={tempAvailablePoints}
        onAllocatePoint={
          onAllocatePoint ? () => onAllocatePoint('defense', 1) : undefined
        }
        onDeallocatePoint={
          onAllocatePoint ? () => onAllocatePoint('defense', -1) : undefined
        }
        canDeallocate={
          isAllocating && tempStatus
            ? tempStatus.defense > status.defense
            : false
        }
        originalValue={status.defense}
      />
      <CharacterStatusBarItem
        name="Speed"
        value={displayStatus.speed}
        maxValue={MAX_STATUS}
        isAllocating={isAllocating}
        tempAvailablePoints={tempAvailablePoints}
        onAllocatePoint={
          onAllocatePoint ? () => onAllocatePoint('speed', 1) : undefined
        }
        onDeallocatePoint={
          onAllocatePoint ? () => onAllocatePoint('speed', -1) : undefined
        }
        canDeallocate={
          isAllocating && tempStatus ? tempStatus.speed > status.speed : false
        }
        originalValue={status.speed}
      />
      <CharacterStatusBarItem
        name="Critical"
        value={displayStatus.critical}
        maxValue={MAX_STATUS}
        isAllocating={isAllocating}
        tempAvailablePoints={tempAvailablePoints}
        onAllocatePoint={
          onAllocatePoint ? () => onAllocatePoint('critical', 1) : undefined
        }
        onDeallocatePoint={
          onAllocatePoint ? () => onAllocatePoint('critical', -1) : undefined
        }
        canDeallocate={
          isAllocating && tempStatus
            ? tempStatus.critical > status.critical
            : false
        }
        originalValue={status.critical}
      />
    </div>
  );
}

interface CharacterStatusBarItemProps {
  name: string;
  value: number;
  maxValue: number;
  isAllocating?: boolean;
  tempAvailablePoints?: number;
  onAllocatePoint?: () => void;
  onDeallocatePoint?: () => void;
  canDeallocate?: boolean;
  pointRatio?: number;
  originalValue?: number;
}

export const CharacterStatusBarItem = ({
  name,
  value,
  maxValue,
  isAllocating = false,
  tempAvailablePoints = 0,
  onAllocatePoint,
  onDeallocatePoint,
  canDeallocate = false,
  pointRatio = 1,
  originalValue = 0,
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
        <span
          className={classNames(
            'min-w-[2rem] text-right font-mono text-xs text-gray-600 dark:text-gray-400',
            isAllocating && 'min-w-[4rem] text-blue-500'
          )}
        >
          {value}
          {isAllocating && (
            <span className="ml-1 text-gray-400">({originalValue})</span>
          )}
        </span>
        {isAllocating && (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onDeallocatePoint}
              disabled={!canDeallocate}
              className="h-6 w-6 p-0 text-xs"
              title={`Decrease ${name} by ${pointRatio} (costs 1 point)`}
            >
              -
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onAllocatePoint}
              disabled={tempAvailablePoints === 0}
              className="h-6 w-6 p-0 text-xs"
              title={`Increase ${name} by ${pointRatio} (costs 1 point)`}
            >
              +
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
