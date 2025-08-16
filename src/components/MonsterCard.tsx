import React from 'react';
import { Card, CardBody } from '~/components/ui';
import { MAX_HEALTH, MAX_STATUS } from '~/constants/characters/job';
import type { Monster } from '~/types/monster';
import { CharacterStatusBarItem } from './character-status/CharacterStatusBar';

/**
 * MonsterDetailCard - A comprehensive component for displaying monster information
 *
 * @param monster - The monster data to display
 * @param showHeader - Whether to show the monster name, level, and description header
 * @param className - Additional CSS classes to apply
 * @param variant - Display variant: 'default' for full size, 'compact' for smaller display
 *
 * @example
 * // Full monster card
 * <MonsterDetailCard monster={monsterData} />
 *
 * // Compact monster card without header
 * <MonsterDetailCard
 *   monster={monsterData}
 *   showHeader={false}
 *   variant="compact"
 * />
 *
 * // Custom styling
 * <MonsterDetailCard
 *   monster={monsterData}
 *   className="border-2 border-red-500"
 * />
 */
interface MonsterDetailCardProps {
  monster: Monster;
  showHeader?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

const MonsterDetailCard: React.FC<MonsterDetailCardProps> = ({
  monster,
  showHeader = true,
  className = '',
  variant = 'default',
}) => {
  const isCompact = variant === 'compact';
  const spacing = isCompact ? 'space-y-3' : 'space-y-4';

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${className} ${isCompact ? 'p-2' : 'p-4'}`}
    >
      <CardBody>
        <div className={spacing}>
          {/* Header Section */}
          {showHeader && (
            <div
              className={`border-b border-gray-200 pb-2 dark:border-gray-600 ${isCompact ? 'pb-1' : ''}`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`font-bold text-gray-800 dark:text-white ${isCompact ? 'text-base' : 'text-lg'}`}
                >
                  {monster.name}
                </h3>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-medium text-gray-500 ${isCompact ? 'text-xs' : 'text-xs'}`}
                  >
                    Lv
                  </span>
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {monster.level}
                  </span>
                </div>
              </div>
              <p
                className={`mt-1 text-gray-600 dark:text-gray-300 ${isCompact ? 'text-xs' : 'text-sm'}`}
              >
                {monster.description}
              </p>
            </div>
          )}

          {/* Status Bars Section */}
          <div className={isCompact ? 'space-y-1.5' : 'space-y-2'}>
            <CharacterStatusBarItem
              name="Health"
              value={monster.health}
              maxValue={MAX_HEALTH}
            />
            <CharacterStatusBarItem
              name="Attack"
              value={monster.attack}
              maxValue={MAX_STATUS}
            />
            <CharacterStatusBarItem
              name="Defense"
              value={monster.defense}
              maxValue={MAX_STATUS}
            />
            <CharacterStatusBarItem
              name="Speed"
              value={monster.speed}
              maxValue={MAX_STATUS}
            />
            <CharacterStatusBarItem
              name="Critical"
              value={monster.critical}
              maxValue={MAX_STATUS}
            />
          </div>

          {/* Rewards Section */}
          <div
            className={`border-t border-gray-200 pt-2 dark:border-gray-600 ${isCompact ? 'pt-1.5' : ''}`}
          >
            <div className="flex gap-3">
              <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    XP
                  </span>
                </div>
                <div
                  className={`font-bold text-yellow-600 dark:text-yellow-400 ${isCompact ? 'text-sm' : 'text-base'}`}
                >
                  {monster.experience}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    💰
                  </span>
                </div>
                <div
                  className={`font-bold text-yellow-600 dark:text-yellow-400 ${isCompact ? 'text-sm' : 'text-base'}`}
                >
                  {monster.gold}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MonsterDetailCard;
