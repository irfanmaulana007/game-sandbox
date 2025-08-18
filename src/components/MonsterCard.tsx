import React, { useMemo, useState } from 'react';
import { Card, CardBody } from '~/components/ui';
import MonsterDetailModal from './MonsterDetailModal';
import { numberFormat } from '~/utils/number';
import type { MonsterDetail } from '~/types/monster';

interface MonsterCardProps {
  monster: MonsterDetail;
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

  const monsterRanges = useMemo(() => {
    const minLevel = Math.min(...monster.monsters.map((m) => m.level));
    const maxLevel = Math.max(...monster.monsters.map((m) => m.level));
    const minHealth = Math.min(...monster.monsters.map((m) => m.health));
    const maxHealth = Math.max(...monster.monsters.map((m) => m.health));
    const minAttack = Math.min(...monster.monsters.map((m) => m.attack));
    const maxAttack = Math.max(...monster.monsters.map((m) => m.attack));
    const minDefense = Math.min(...monster.monsters.map((m) => m.defense));
    const maxDefense = Math.max(...monster.monsters.map((m) => m.defense));
    const minSpeed = Math.min(...monster.monsters.map((m) => m.speed));
    const maxSpeed = Math.max(...monster.monsters.map((m) => m.speed));
    const minCritical = Math.min(...monster.monsters.map((m) => m.critical));
    const maxCritical = Math.max(...monster.monsters.map((m) => m.critical));
    const minExperience = Math.min(
      ...monster.monsters.map((m) => m.experience_reward)
    );
    const maxExperience = Math.max(
      ...monster.monsters.map((m) => m.experience_reward)
    );
    const minGold = Math.min(...monster.monsters.map((m) => m.gold_reward));
    const maxGold = Math.max(...monster.monsters.map((m) => m.gold_reward));
    return {
      minLevel,
      maxLevel,
      minHealth,
      maxHealth,
      minAttack,
      maxAttack,
      minDefense,
      maxDefense,
      minSpeed,
      maxSpeed,
      minCritical,
      maxCritical,
      minExperience,
      maxExperience,
      minGold,
      maxGold,
    };
  }, [monster]);

  return (
    <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
      <Card
        className={`h-full transition-all duration-200 hover:shadow-lg ${className} ${isCompact ? 'p-2' : 'p-4'}`}
      >
        <CardBody className="h-full">
          <div className="flex h-full flex-col justify-between gap-y-2">
            <div className={`${spacing} h-full`}>
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
                        {monsterRanges.minLevel}-{monsterRanges.maxLevel}
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
                    {monsterRanges.minHealth}-{monsterRanges.maxHealth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attack
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {monsterRanges.minAttack}-{monsterRanges.maxAttack}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Defense
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {monsterRanges.minDefense}-{monsterRanges.maxDefense}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Speed
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {monsterRanges.minSpeed}-{monsterRanges.maxSpeed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Critical
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {monsterRanges.minCritical}-{monsterRanges.maxCritical}
                  </span>
                </div>
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
                    {numberFormat(monsterRanges.minExperience)}-
                    {numberFormat(monsterRanges.maxExperience)}
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
                    {numberFormat(monsterRanges.minGold)}-
                    {numberFormat(monsterRanges.maxGold)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        {/* Monster Detail Modal */}
        {isModalOpen && (
          <MonsterDetailModal
            monster={monster}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Card>
    </div>
  );
};

export default MonsterCard;
