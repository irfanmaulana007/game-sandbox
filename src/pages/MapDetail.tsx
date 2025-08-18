import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '~/components/layout';
import { Button } from '~/components/ui';
import { DIFFICULTY_COLORS } from '~/constants/colors';
import { useMapDetail } from '~/services/map-service';
import MapZoneCard from '~/components/MapZoneCard';

// Battle monster interface that combines base monster with status

const MapDetail: React.FC = () => {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();

  const { data: mapData } = useMapDetail(Number(mapId));
  const map = mapData?.data;

  const mapRecommendedLevel = useMemo(() => {
    if (!map) return 0;
    return Math.floor((map.min_level + map.max_level) / 2) + 1;
  }, [map]);

  if (!map) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Map not found</h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Maps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            className="mb-4"
            variant="outline"
          >
            ← Back to Explore
          </Button>

          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`text-3xl font-bold ${DIFFICULTY_COLORS[map.difficulty]}`}
                >
                  {map.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {map.description}
                </p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Min Level:
                    </span>
                    <span
                      className={`text-lg font-bold ${DIFFICULTY_COLORS[map.difficulty]}`}
                    >
                      {map.min_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recommended:
                    </span>
                    <span
                      className={`text-lg font-bold ${DIFFICULTY_COLORS[map.difficulty]}`}
                    >
                      {mapRecommendedLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Zone Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Map Zones
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {map.map_zones.map((mapZone) => (
              <MapZoneCard key={mapZone.id} mapZone={mapZone} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapDetail;
