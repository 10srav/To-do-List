'use client';

import { useState } from 'react';
import { FilterOptions, Task, Event } from '@/types';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterPanelProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  tasks: Task[];
  events: Event[];
}

export default function FilterPanel({ filters, setFilters, tasks, events }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for filter options
  const allTags = Array.from(new Set([
    ...tasks.flatMap(task => task.tags),
    ...events.flatMap(event => event.tags)
  ])).sort();

  const allPriorities = ['low', 'medium', 'high'] as const;
  const allTaskStatuses = ['pending', 'in-progress', 'completed'] as const;
  const allEventStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    setFilters({ ...filters, status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = checked
      ? [...currentPriorities, priority]
      : currentPriorities.filter(p => p !== priority);
    
    setFilters({ ...filters, priority: newPriorities.length > 0 ? newPriorities : undefined });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tags || [];
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag);
    
    setFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const currentRange = filters.dateRange || { start: new Date(), end: new Date() };
    const newRange = {
      ...currentRange,
      [field]: value ? new Date(value) : new Date()
    };
    
    setFilters({ 
      ...filters, 
      dateRange: newRange.start && newRange.end ? newRange : undefined 
    });
  };

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value || undefined });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterOptions];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'object' && value !== null) return true;
    return false;
  });

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {tasks.length + events.length} total items
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tasks and events..."
              className="input"
            />
          </div>

          {/* Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Task Status</h4>
              <div className="space-y-2">
                {allTaskStatuses.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status) || false}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Event Status</h4>
              <div className="space-y-2">
                {allEventStatuses.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status) || false}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Priority Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Priority</h4>
            <div className="flex space-x-4">
              {allPriorities.map((priority) => (
                <label key={priority} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priority?.includes(priority) || false}
                    onChange={(e) => handlePriorityChange(priority, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Start Date</label>
                 <input
                   id="start-date"
                   type="date"
                   value={filters.dateRange?.start?.toISOString().split('T')[0] || ''}
                   onChange={(e) => handleDateRangeChange('start', e.target.value)}
                   className="input"
                   aria-label="Filter by start date"
                 />
               </div>
               <div>
                 <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">End Date</label>
                 <input
                   id="end-date"
                   type="date"
                   value={filters.dateRange?.end?.toISOString().split('T')[0] || ''}
                   onChange={(e) => handleDateRangeChange('end', e.target.value)}
                   className="input"
                   aria-label="Filter by end date"
                 />
               </div>
             </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag) || false}
                      onChange={(e) => handleTagChange(tag, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      #{tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {filters.status?.map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    Status: {status}
                    <button
                      onClick={() => handleStatusChange(status, false)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      aria-label={`Remove status filter ${status}`}
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.priority?.map((priority) => (
                  <span
                    key={priority}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  >
                    Priority: {priority}
                    <button
                      onClick={() => handlePriorityChange(priority, false)}
                      className="ml-1 text-green-600 hover:text-green-800"
                      aria-label={`Remove priority filter ${priority}`}
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                  >
                    Tag: #{tag}
                    <button
                      onClick={() => handleTagChange(tag, false)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                      aria-label={`Remove tag filter ${tag}`}
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleSearchChange('')}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                      aria-label="Clear search"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 