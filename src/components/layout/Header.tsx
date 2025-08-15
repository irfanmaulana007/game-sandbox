import React from 'react';
import { APP_NAME } from '~/constants';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {APP_NAME}
            </h1>
          </div>

          <div className="flex items-center space-x-4">header</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
