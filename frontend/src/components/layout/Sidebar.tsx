import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  FolderIcon, 
  TagIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';
import { cn } from '../../utils';

const navigation = [
  { name: 'Dashboard', href: '/home', icon: HomeIcon },
  { name: 'Prompts', href: '/prompts', icon: DocumentTextIcon },
  { name: 'Categories', href: '/categories', icon: FolderIcon },
  { name: 'Tags', href: '/tags', icon: TagIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-6">
          <Link to="/" className="flex items-center space-x-2">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Prompt Manager</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/home' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 shrink-0',
                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/prompts/new"
            className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            New Prompt
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;