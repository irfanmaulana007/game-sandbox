import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '~/components/layout';
import useCharacterStore from '~/store/character-store';
import { MAPS } from '~/constants/map';
import MapCard from '~/components/MapCard';

const Home: React.FC = () => {
  const { character } = useCharacterStore();

  if (!character) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Maps Section */}
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Available Maps
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MAPS.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
