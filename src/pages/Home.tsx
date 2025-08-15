import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '~/components/layout';
import useCharacterStore from '~/store/character-store';

const Home: React.FC = () => {
  const { character } = useCharacterStore();

  if (!character) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold text-blue-600">Home Page</h1>
      </div>
    </Layout>
  );
};

export default Home;
