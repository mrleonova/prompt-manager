import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  HeartIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePrompts } from '../hooks/usePrompts';
import { formatRelativeTime, truncateText } from '../utils';

const PromptsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    isTemplate: undefined,
    isFavorite: undefined,
  });

  const { data, isLoading, error } = usePrompts({
    search,
    ...filters,
    limit: 12,
  });

  const prompts = data?.data?.prompts || [];
  const pagination = data?.data?.pagination;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load prompts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
          <p className="mt-1 text-gray-500">
            {pagination?.total || 0} prompts total
          </p>
        </div>
        <Link to="/prompts/new">
          <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
            New Prompt
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" leftIcon={<FunnelIcon className="h-4 w-4" />}>
            Filters
          </Button>
          <div className="flex border rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ViewColumnsIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <DocumentIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
          <p className="text-gray-500 mb-4">
            {search ? 'Try adjusting your search terms' : 'Get started by creating your first prompt'}
          </p>
          <Link to="/prompts/new">
            <Button>Create Your First Prompt</Button>
          </Link>
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                view === 'list' ? 'p-4' : 'p-6'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/prompts/${prompt.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                  >
                    {prompt.title}
                  </Link>
                  {prompt.description && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {truncateText(prompt.description, 100)}
                    </p>
                  )}
                </div>
                <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                  {prompt.is_favorite ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-4">
                  {prompt.category_name && (
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: prompt.category_color + '20',
                        color: prompt.category_color,
                      }}
                    >
                      {prompt.category_name}
                    </span>
                  )}
                  {prompt.is_template && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Template
                    </span>
                  )}
                </div>
                <span>{formatRelativeTime(prompt.updated_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{prompt.tags.length - 3} more
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  Used {prompt.usage_count} times
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{pagination.current}</span> of{' '}
                <span className="font-medium">{pagination.pages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current === pagination.pages}
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptsPage;