import React from 'react';
import { Card, CardBody, Modal } from '~/components/ui';
import type { MonsterDetail } from '~/types/monster';
import { MAX_HEALTH, MAX_STATUS } from '~/constants/characters/job';
import { useMonsterDetailDetail } from '~/services/monster-service';
import type { Monsters } from '~/types/model/schema';

interface MonsterDetailModalProps {
  monster: MonsterDetail;
  isOpen: boolean;
  onClose: () => void;
}

const MonsterDetailModal: React.FC<MonsterDetailModalProps> = ({
  monster,
  isOpen,
  onClose,
}) => {
  const { data: monsterDetail } = useMonsterDetailDetail(monster.id);
  const monsters = monsterDetail?.data.monsters || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${monster.name} - Monster Details`}
      size="xl"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {monsters.map((monsterItem) => (
          <MonsterCardDetailItem key={monster.id} monster={monsterItem} />
        ))}
      </div>
    </Modal>
  );
};

const MonsterCardDetailItem = ({ monster }: { monster: Monsters }) => {
  return (
    <Card className="p-2">
      <CardBody>
        <div>
          <div
            className={`mb-2 border-b border-gray-200 pb-2 dark:border-gray-600`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium text-gray-500`}>
                  Level
                </span>
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {monster.level}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium text-gray-500`}>
                  Rank
                </span>
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                  {monster.rank}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <MonsterStatusBarItem
              name="Health"
              value={monster.health}
              maxValue={MAX_HEALTH}
            />
            <MonsterStatusBarItem
              name="Attack"
              value={monster.attack}
              maxValue={MAX_STATUS}
            />
            <MonsterStatusBarItem
              name="Defense"
              value={monster.defense}
              maxValue={MAX_STATUS}
            />
            <MonsterStatusBarItem
              name="Speed"
              value={monster.speed}
              maxValue={MAX_STATUS}
            />
            <MonsterStatusBarItem
              name="Critical"
              value={monster.critical}
              maxValue={MAX_STATUS}
            />
          </div>

          {/* Rewards Section - Show ranges */}
          <div
            className={`mt-2 border-t border-gray-200 pt-2 dark:border-gray-600`}
          >
            <div className={`flex gap-3`}>
              <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800`}
                >
                  <span
                    className={`text-2xs font-bold text-yellow-600 dark:text-yellow-400`}
                  >
                    XP
                  </span>
                </div>
                <div
                  className={`text-xs font-bold text-yellow-600 dark:text-yellow-400`}
                >
                  {monster.experience_reward}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800`}
                >
                  <span
                    className={`text-2xs font-bold text-yellow-600 dark:text-yellow-400`}
                  >
                    💰
                  </span>
                </div>
                <div
                  className={`text-xs font-bold text-yellow-600 dark:text-yellow-400`}
                >
                  {monster.gold_reward}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const MonsterStatusBarItem = ({
  name,
  value,
  maxValue,
}: {
  name: string;
  value: number;
  maxValue: number;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>
      </div>
      <div className="flex w-3/5 items-center gap-2">
        <div className="relative h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full bg-blue-500`}
            style={{
              width: `${(value / maxValue) * 100}%`,
            }}
          />
        </div>
        <span className="min-w-[1rem] text-right font-mono text-2xs text-gray-600 dark:text-gray-400">
          {value}
        </span>
      </div>
    </div>
  );
};

export default MonsterDetailModal;
