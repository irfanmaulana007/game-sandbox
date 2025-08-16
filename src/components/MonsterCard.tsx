import React, { useState } from 'react';
import { Card, CardBody } from '~/components/ui';
import type { MonsterWithRanges } from '~/types/monster';
import MonsterDetailModal from './MonsterDetailModal';

/**
 * MonsterCard - A component for displaying monster information with rank ranges
 *
 * @param monster - The monster data with ranges to display
 * @param showHeader - Whether to show the monster name and description header
 * @param className - Additional CSS classes to apply
 * @param variant - Display variant: 'default' for full size, 'compact' for smaller display
 *
 * @example
 * // Full monster card
 * <MonsterCard monster={monsterData} />
 *
 * // Compact monster card without header
 * <MonsterCard
 *   monster={monsterData}
 *   showHeader={false}
 *   variant="compact"
 * />
 *
 * // Custom styling
 * <MonsterCard
 *   monster={monsterData}
 *   className="border-2 border-red-500"
 * />
 */
interface MonsterCardProps {
  monster: MonsterWithRanges;
  showHeader?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

const MonsterCard: React.FC<MonsterCardProps> = ({
  monster,
  showHeader = true,
  className = '',
  variant = 'default',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCompact = variant === 'compact';
  const spacing = isCompact ? 'space-y-3' : 'space-y-4';

  return (
    <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
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
                      {monster.rankRanges.level.min}-
                      {monster.rankRanges.level.max}
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

            {/* Status Bars Section - Show ranges */}
            <div className={isCompact ? 'space-y-1.5' : 'space-y-2'}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Health
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {monster.rankRanges.status.health.min}-
                  {monster.rankRanges.status.health.max}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Attack
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {monster.rankRanges.status.attack.min}-
                  {monster.rankRanges.status.attack.max}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Defense
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {monster.rankRanges.status.defense.min}-
                  {monster.rankRanges.status.defense.max}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Speed
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {monster.rankRanges.status.speed.min}-
                  {monster.rankRanges.status.speed.max}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Critical
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {monster.rankRanges.status.critical.min}-
                  {monster.rankRanges.status.critical.max}
                </span>
              </div>
            </div>

            {/* Rewards Section - Show ranges */}
            <div
              className={`border-t border-gray-200 pt-2 dark:border-gray-600 ${isCompact ? 'pt-1.5' : ''}`}
            >
              <div className={`flex gap-3 ${isCompact ? 'gap-1' : ''}`}>
                <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                  <div
                    className={`flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800 ${isCompact ? 'h-5 w-5' : 'h-6 w-6'}`}
                  >
                    <span
                      className={`font-bold text-yellow-600 dark:text-yellow-400 ${isCompact ? 'text-2xs' : 'text-sm'}`}
                    >
                      XP
                    </span>
                  </div>
                  <div
                    className={`font-bold text-yellow-600 dark:text-yellow-400 ${isCompact ? 'text-xs' : 'text-sm'}`}
                  >
                    {monster.rankRanges.experience.min}-
                    {monster.rankRanges.experience.max}
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                  <div
                    className={`flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800 ${isCompact ? 'h-5 w-5' : 'h-6 w-6'}`}
                  >
                    <span
                      className={`font-bold text-yellow-600 dark:text-yellow-400 ${isCompact ? 'text-xs' : 'text-sm'}`}
                    >
                      💰
                    </span>
                  </div>
                  <div
                    className={`font-bold text-yellow-600 dark:text-yellow-400 ${isCompact ? 'text-xs' : 'text-sm'}`}
                  >
                    {monster.rankRanges.gold.min}-{monster.rankRanges.gold.max}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        {/* Monster Detail Modal */}
        <MonsterDetailModal
          monster={monster}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Card>
    </div>
  );
};

export default MonsterCard;
