import type { Map } from '~/types/map';
import { Card, CardBody, Button } from '~/components/ui';
import { DIFFICULTY_COLORS } from '~/constants/colors';
import useCharacterStore from '~/store/character-store';
import { useCallback } from 'react';
import type { MapDifficulty } from '~/types/map';
import { useNavigate } from 'react-router-dom';

interface MapProps {
  map: Map;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function MapCard({
  map,
  isSelected = false,
  onClick,
}: MapProps) {
  const { character } = useCharacterStore();
  const navigate = useNavigate();

  const getDifficulty = useCallback((): MapDifficulty => {
    if (!character) return 'easy';

    if (map.minLevel - character.level <= 0) return 'easy';
    if (map.minLevel - character.level <= 2) return 'medium';
    if (map.minLevel - character.level <= 4) return 'hard';
    return 'very_hard';
  }, [character, map.minLevel]);

  const handleEnterMap = () => {
    navigate(`/map/${map.id}`);
  };

  if (!character) return null;

  return (
    <div onClick={onClick}>
      <Card
        className={`h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected
            ? 'border-blue-300 ring-2 ring-blue-500 dark:border-blue-600'
            : 'hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <CardBody className="h-full">
          <div className="flex h-full flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3
                    className={`text-xl font-bold ${DIFFICULTY_COLORS[getDifficulty()]}`}
                  >
                    {map.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Min Level
                  </span>
                  <span
                    className={`text-xs font-semibold ${DIFFICULTY_COLORS[getDifficulty()]}`}
                  >
                    {map.minLevel}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Recommended
                  </span>
                  <span
                    className={`text-xs font-semibold ${DIFFICULTY_COLORS[getDifficulty()]}`}
                  >
                    {map.recommendedLevel}
                  </span>
                </div>
              </div>
            </div>

            <hr />

            <div className="flex h-full flex-col justify-between gap-y-4">
              <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {map.description}
              </p>
              <Button
                className="w-full"
                onClick={handleEnterMap}
                disabled={character.level < map.minLevel}
              >
                Enter Map
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
