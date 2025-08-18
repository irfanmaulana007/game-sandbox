import React from 'react';
import { Card, CardHeader, CardBody } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import type { CharacterWithJob } from '~/types/model/character';

interface LevelUpModalProps {
  isVisible: boolean;
  onClose: () => void;
  character: CharacterWithJob | null;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isVisible,
  onClose,
  character,
}) => {
  if (!isVisible || !character) return null;

  return (
    <div className="animate-in slide-in-from-bottom-2 fixed bottom-6 right-6 z-50 duration-300">
      <Card className="w-80 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                <span className="text-sm font-bold text-white">↑</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Level Up!
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          {/* Level Information */}
          <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Level Up
              </span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {character.level - 1} → {character.level}
              </span>
            </div>
          </div>

          {/* Status Changes */}
          <div className="space-y-2">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Status Changes
            </h4>
            <StatusChangeItem
              statusName="Health"
              statusValue={character.max_health}
              statusChange={character.job.health_per_level}
            />
            <StatusChangeItem
              statusName="Attack"
              statusValue={character.attack}
              statusChange={character.job.attack_per_level}
            />
            <StatusChangeItem
              statusName="Defense"
              statusValue={character.defense}
              statusChange={character.job.defense_per_level}
            />
            <StatusChangeItem
              statusName="Speed"
              statusValue={character.speed}
              statusChange={character.job.speed_per_level}
            />
            <StatusChangeItem
              statusName="Critical"
              statusValue={character.critical}
              statusChange={character.job.critical_per_level}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const StatusChangeItem = ({
  statusName,
  statusValue,
  statusChange,
}: {
  statusName: string;
  statusValue: number;
  statusChange: number;
}) => {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {statusName}
      </span>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {statusValue - statusChange}
        </span>
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          ↗ {statusValue}
        </span>
      </div>
    </div>
  );
};

export default LevelUpModal;
