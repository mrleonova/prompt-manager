import React from 'react';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md">
            <Input
              type="text"
              placeholder="Search prompts..."
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              className="border-gray-300"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <button
            type="button"
            className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;