import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Layout } from '~/components/layout';
import useCharacterStore from '~/store/character-store';
import { MAPS } from '~/constants/map';
import MapCard from '~/components/MapCard';
import { useAuth } from '../context';
import { useToast } from '~/hooks';

const Home: React.FC = () => {
  const { character } = useCharacterStore();
  const { isAuthenticated } = useAuth();
  const { success, error, warning, info } = useToast();

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div>
            <h1 className="mb-6 text-5xl font-bold text-white">
              Welcome to the Game
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
              Embark on an epic adventure in a world filled with monsters,
              magic, and endless possibilities. Create your character, explore
              mysterious maps, and battle fierce creatures.
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
              <h3 className="mb-3 text-xl font-semibold text-white">
                New Player?
              </h3>
              <p className="mb-4 text-gray-300">
                Start your journey by creating an account
              </p>
              <Link
                to="/register"
                className="block w-full rounded-lg bg-gradient-to-r from-green-500 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-blue-700"
              >
                Get Started
              </Link>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Returning Player?
              </h3>
              <p className="mb-4 text-gray-300">
                Continue your adventure by signing in
              </p>
              <Link
                to="/login"
                className="block w-full rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-lg transition-all duration-200 hover:bg-white/20"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="pt-8">
            <Link
              to="/onboarding"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Continue without account →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If no character, redirect to onboarding
  if (!character) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Toast Test Section - Development Only */}
        {import.meta.env.DEV && (
          <div className="mb-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
              Toast Test (Development Only)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => success('Success toast! 🎉')}
                className="rounded bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-600"
              >
                Success Toast
              </button>
              <button
                onClick={() => error('Error toast! ❌')}
                className="rounded bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
              >
                Error Toast
              </button>
              <button
                onClick={() => warning('Warning toast! ⚠️')}
                className="rounded bg-yellow-500 px-3 py-2 text-white transition-colors hover:bg-yellow-600"
              >
                Warning Toast
              </button>
              <button
                onClick={() => info('Info toast! ℹ️')}
                className="rounded bg-blue-500 px-3 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Info Toast
              </button>
            </div>
          </div>
        )}

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
