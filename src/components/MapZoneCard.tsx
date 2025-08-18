import { Card, CardBody, Button } from '~/components/ui';
import { useNavigate } from 'react-router-dom';
import type { MapZones } from '~/types/model/schema';
import { useMyCharacter } from '~/services/character-service';

interface MapProps {
  mapZone: MapZones;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function MapZoneCard({
  mapZone,
  isSelected = false,
  onClick,
}: MapProps) {
  const { data } = useMyCharacter();
  const navigate = useNavigate();

  const character = data?.data;

  const handleEnterMap = () => {
    navigate(`/map/${mapZone.map_id}/zone/${mapZone.id}`);
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
                  <h3 className="text-xl font-bold">{mapZone.name}</h3>
                </div>
              </div>
            </div>

            <hr />

            <div className="flex h-full flex-col justify-between gap-y-4">
              <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {mapZone.description}
              </p>
              <Button className="w-full" onClick={handleEnterMap}>
                Enter Map
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
