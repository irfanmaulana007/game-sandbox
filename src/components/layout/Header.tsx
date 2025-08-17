import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~/context';
import { useToast } from '~/hooks';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      showError('Logout failed. Please try again.');
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/character"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Character
                </Link>
                <Link
                  to="/inventory"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Inventory
                </Link>
                <Link
                  to="/equipment"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Equipment
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="text-xl font-bold text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                >
                  Game Client
                </Link>
              </div>
            )}
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, {user?.username}!
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
