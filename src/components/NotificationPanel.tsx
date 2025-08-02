'use client';

import { useState, useEffect } from 'react';
import { Task, Event } from '@/types';
import { checkOverdueItems, checkUpcomingItems } from '@/lib/utils';
import { 
  BellIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface NotificationPanelProps {
  tasks: Task[];
  events: Event[];
}

export default function NotificationPanel({ tasks, events }: NotificationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [overdueItems, setOverdueItems] = useState<{ tasks: Task[], events: Event[] }>({ tasks: [], events: [] });
  const [upcomingItems, setUpcomingItems] = useState<{ tasks: Task[], events: Event[] }>({ tasks: [], events: [] });

  useEffect(() => {
    const { overdueTasks, overdueEvents } = checkOverdueItems(tasks, events);
    const { upcomingTasks, upcomingEvents } = checkUpcomingItems(tasks, events);
    
    setOverdueItems({ tasks: overdueTasks, events: overdueEvents });
    setUpcomingItems({ tasks: upcomingTasks, events: upcomingEvents });
  }, [tasks, events]);
  // Calculate total notifications
  

  const totalNotifications = overdueItems.tasks.length + overdueItems.events.length + 
                           upcomingItems.tasks.length + upcomingItems.events.length;

  if (totalNotifications === 0) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <BellIcon className="h-5 w-5" />
            <span>Notifications</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {totalNotifications}
            </span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Overdue Items */}
          {(overdueItems.tasks.length > 0 || overdueItems.events.length > 0) && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-medium text-red-700">Overdue</h3>
              </div>
              
              <div className="space-y-2">
                {overdueItems.tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-900">{task.title}</div>
                        <div className="text-xs text-red-600 mt-1">
                          Due {task.dueDate?.toLocaleDateString()}
                          {task.dueTime && ` at ${task.dueTime}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {overdueItems.events.map((event) => (
                  <div key={event.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-900">{event.title}</div>
                        <div className="text-xs text-red-600 mt-1">
                          Ended {event.endDate.toLocaleDateString()}
                          {event.endTime && ` at ${event.endTime}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Items */}
          {(upcomingItems.tasks.length > 0 || upcomingItems.events.length > 0) && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <ClockIcon className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium text-blue-700">Upcoming</h3>
              </div>
              
              <div className="space-y-2">
                {upcomingItems.tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900">{task.title}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Due {task.dueDate?.toLocaleDateString()}
                          {task.dueTime && ` at ${task.dueTime}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {upcomingItems.events.map((event) => (
                  <div key={event.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900">{event.title}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Starts {event.startDate.toLocaleDateString()}
                          {event.startTime && ` at ${event.startTime}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Mark all overdue as complete
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Snooze notifications
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Notification settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 