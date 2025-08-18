import { Card, CardBody, Button } from '~/components/ui';
import { DIFFICULTY_COLORS } from '~/constants/colors';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Maps } from '~/types/model/schema';
import { useMyCharacter } from '~/services/character-service';

interface MapProps {
  map: Maps;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function MapCard({
  map,
  isSelected = false,
  onClick,
}: MapProps) {
  const { data } = useMyCharacter();
  const navigate = useNavigate();

  const character = data?.data;

  const recommendedLevel = useMemo(() => {
    const minLevel = map.min_level;
    const maxLevel = map.max_level;

    return Math.floor((minLevel + maxLevel) / 2) + 1;
  }, [map]);

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
                    className={`text-xl font-bold ${DIFFICULTY_COLORS[map.difficulty]}`}
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
                    className={`text-xs font-semibold ${DIFFICULTY_COLORS[map.difficulty]}`}
                  >
                    {map.min_level}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Recommended
                  </span>
                  <span
                    className={`text-xs font-semibold ${DIFFICULTY_COLORS[map.difficulty]}`}
                  >
                    {recommendedLevel}
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
                disabled={character.level < map.min_level}
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
