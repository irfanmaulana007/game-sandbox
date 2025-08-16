import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link to="/">Home</Link>
              <Link to="/character">Character</Link>
              <Link to="/inventory">Inventory</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
