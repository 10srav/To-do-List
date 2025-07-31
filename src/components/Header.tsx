'use client';

import { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { CalendarView } from '@/types';
import { format } from 'date-fns';

interface HeaderProps {
  onAddClick: () => void;
  view: 'list' | 'calendar';
  calendarView: CalendarView;
}

export default function Header({ onAddClick, view, calendarView }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getViewTitle = () => {
    if (view === 'calendar') {
      const { type, currentDate } = calendarView;
      if (type === 'month') {
        return format(currentDate, 'MMMM yyyy');
      } else if (type === 'week') {
        return `Week of ${format(currentDate, 'MMM dd, yyyy')}`;
      } else {
        return format(currentDate, 'MMMM dd, yyyy');
      }
    }
    return 'My Tasks & Events';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {getViewTitle()}
          </h1>
          
          {view === 'list' && (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks and events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onAddClick}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Item</span>
          </button>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 