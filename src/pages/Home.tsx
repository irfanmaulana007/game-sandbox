import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '~/components/layout';
import MapCard from '~/components/MapCard';
import { useMyCharacter } from '~/services/character-service';
import { useMaps } from '~/services/map-service';

const Home: React.FC = () => {
  const { data: character, isLoading } = useMyCharacter();
  const { data, isLoading: isMapsLoading } = useMaps({ limit: 100 });

  const maps = useMemo(() => {
    return (
      data?.data
        .sort((a, b) => a.max_level - b.max_level)
        .sort((a, b) => a.min_level - b.min_level) || []
    );
  }, [data]);
  console.log('🚀 ~ Home ~ maps:', maps);

  if (isLoading || isMapsLoading) {
    return <div>Loading...</div>;
  }

  // If no character, redirect to onboarding
  if (!character?.data) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Maps Section */}
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Maps
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
