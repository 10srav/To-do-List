'use client';

import { 
  ListBulletIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  StarIcon,
  ExclamationTriangleIcon,
  TagIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { CalendarView } from '@/types';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

interface SidebarProps {
  view: 'list' | 'calendar' | 'messages' | 'profile';
  setView: (view: 'list' | 'calendar' | 'messages' | 'profile') => void;
  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Sidebar({ view, setView, calendarView, setCalendarView, user }: SidebarProps) {
  const navigationItems = [
    { id: 'list', name: 'List View', icon: ListBulletIcon, current: view === 'list' },
    { id: 'calendar', name: 'Calendar View', icon: CalendarIcon, current: view === 'calendar' },
    { id: 'messages', name: 'Messages', icon: EnvelopeIcon, current: view === 'messages' },
  ];

  const quickFilters = [
    { id: 'completed', name: 'Completed', icon: CheckCircleIcon, count: 12 },
    { id: 'upcoming', name: 'Upcoming', icon: ClockIcon, count: 5 },
    { id: 'starred', name: 'Starred', icon: StarIcon, count: 3 },
    { id: 'overdue', name: 'Overdue', icon: ExclamationTriangleIcon, count: 2 },
  ];

  const handleViewChange = (viewId: string) => {
    setView(viewId as 'list' | 'calendar' | 'messages' | 'profile');
  };

  const handleCalendarNavigation = (direction: 'prev' | 'next') => {
    const { type, currentDate } = calendarView;
    let newDate: Date;

    switch (type) {
      case 'month':
        newDate = direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
        break;
      case 'day':
        newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
        break;
      default:
        newDate = currentDate;
    }

    setCalendarView({ ...calendarView, currentDate: newDate });
  };

  const handleCalendarViewChange = (viewType: 'month' | 'week' | 'day') => {
    setCalendarView({ ...calendarView, type: viewType });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-primary-600">TaskSaver</h2>
        {user && (
          <div className="mt-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4 text-primary-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Views
          </h3>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Filters */}
        <div className="mt-8 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Filters
          </h3>
          {quickFilters.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Tags
          </h3>
          <div className="space-y-1">
            {['Work', 'Personal', 'Health', 'Finance'].map((tag) => (
              <button
                key={tag}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <TagIcon className="h-4 w-4" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Calendar Controls (only show when in calendar view) */}
      {view === 'calendar' && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Calendar Controls
          </h3>
          
          {/* View Type Selector */}
          <div className="space-y-2 mb-4">
            <div className="flex space-x-1">
              {(['month', 'week', 'day'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleCalendarViewChange(type)}
                  className={`flex-1 px-2 py-1 text-xs rounded ${
                    calendarView.type === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleCalendarNavigation('prev')}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handleCalendarNavigation('next')}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Next
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => setCalendarView({ ...calendarView, currentDate: new Date() })}
            className="w-full mt-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Today
          </button>
        </div>
      )}

      {/* Profile & Settings */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button 
          onClick={() => handleViewChange('profile')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            view === 'profile'
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <UserIcon className="h-5 w-5" />
          <span>Profile</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Cog6ToothIcon className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
} 