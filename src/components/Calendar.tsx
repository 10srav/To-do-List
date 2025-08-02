'use client';

import { useState } from 'react';
import { Task, Event, CalendarView } from '@/types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CalendarProps {
  tasks: Task[];
  events: Event[];
  view: CalendarView;
  onUpdateTask: (task: Task) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function Calendar({
  tasks,
  events,
  view,
  onUpdateTask,
  onUpdateEvent,
  onDeleteTask,
  onDeleteEvent
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getItemsForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const dayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isWithinInterval(task.dueDate, { start: dayStart, end: dayEnd });
    });

    const dayEvents = events.filter(event => {
      return isWithinInterval(event.startDate, { start: dayStart, end: dayEnd }) ||
             isWithinInterval(event.endDate, { start: dayStart, end: dayEnd }) ||
             (event.startDate <= dayStart && event.endDate >= dayEnd);
    });

    return { tasks: dayTasks, events: dayEvents };
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(view.currentDate);
    const monthEnd = endOfMonth(view.currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const { tasks: dayTasks, events: dayEvents } = getItemsForDate(day);
          const isCurrentMonth = isSameMonth(day, view.currentDate);
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[120px] bg-white p-2 cursor-pointer transition-colors ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isCurrentDay ? 'bg-blue-50' : ''} ${
                isSelected ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                    title={task.title}
                  >
                    📋 {task.title}
                  </div>
                ))}
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded bg-purple-100 text-purple-800 truncate"
                    title={event.title}
                  >
                    📅 {event.title}
                  </div>
                ))}
                {(dayTasks.length + dayEvents.length) > 4 && (
                  <div className="text-xs text-gray-500">
                    +{(dayTasks.length + dayEvents.length) - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(view.currentDate);
    const weekEnd = endOfWeek(view.currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {days.map((day) => (
          <div key={day.toISOString()} className="bg-gray-50 p-2 text-center">
            <div className="text-sm font-medium text-gray-700">
              {format(day, 'EEE')}
            </div>
            <div className={`text-lg font-bold ${
              isToday(day) ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {/* Day content */}
        {days.map((day) => {
          const { tasks: dayTasks, events: dayEvents } = getItemsForDate(day);
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[400px] bg-white p-2 cursor-pointer transition-colors ${
                isCurrentDay ? 'bg-blue-50' : ''
              } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-xs p-2 rounded bg-blue-100 text-blue-800 border-l-4 border-blue-500"
                    title={task.title}
                  >
                    <div className="font-medium truncate">{task.title}</div>
                    {task.dueTime && (
                      <div className="text-blue-600">{task.dueTime}</div>
                    )}
                  </div>
                ))}
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-2 rounded bg-purple-100 text-purple-800 border-l-4 border-purple-500"
                    title={event.title}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {event.startTime && (
                      <div className="text-purple-600">
                        {event.startTime} - {event.endTime || ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const day = view.currentDate;
    const { tasks: dayTasks, events: dayEvents } = getItemsForDate(day);

    // Create time slots from 6 AM to 10 PM
    const timeSlots: number[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      timeSlots.push(hour);
    }

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(day, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow border">
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {timeSlots.map((hour) => {
              const timeStart = new Date(day);
              timeStart.setHours(hour, 0, 0, 0);
              const timeEnd = new Date(day);
              timeEnd.setHours(hour + 1, 0, 0, 0);

              const hourTasks = dayTasks.filter(task => {
                if (!task.dueTime) return false;
                const [taskHour] = task.dueTime.split(':').map(Number);
                return taskHour === hour;
              });

              const hourEvents = dayEvents.filter(event => {
                if (!event.startTime) return false;
                const [eventHour] = event.startTime.split(':').map(Number);
                return eventHour === hour;
              });

              return (
                <div key={hour} className="p-4 min-h-[80px]">
                  <div className="flex">
                    <div className="w-16 text-sm font-medium text-gray-500">
                      {format(timeStart, 'h a')}
                    </div>
                    <div className="flex-1 space-y-2">
                      {hourTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r"
                        >
                          <div className="font-medium text-sm">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {task.description}
                            </div>
                          )}
                        </div>
                      ))}
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-2 bg-purple-50 border-l-4 border-purple-500 rounded-r"
                        >
                          <div className="font-medium text-sm">{event.title}</div>
                          {event.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {event.description}
                            </div>
                          )}
                          <div className="text-xs text-purple-600 mt-1">
                            {event.startTime} - {event.endTime || ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;

    const { tasks: dayTasks, events: dayEvents } = getItemsForDate(selectedDate);

    return (
      <div className="bg-white rounded-lg shadow border p-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>

        <div className="space-y-4">
          {dayTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks</h4>
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </div>
                        )}
                        {task.dueTime && (
                          <div className="text-sm text-blue-600 mt-1">
                            Due at {task.dueTime}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onUpdateTask({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' })}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {task.status === 'completed' ? 'Undo' : 'Complete'}
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dayEvents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Events</h4>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </div>
                        )}
                        <div className="text-sm text-purple-600 mt-1">
                          {event.startTime && event.endTime 
                            ? `${event.startTime} - ${event.endTime}`
                            : 'All day'
                          }
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onUpdateEvent({ ...event, status: event.status === 'completed' ? 'upcoming' : 'completed' })}
                          className="text-sm text-purple-600 hover:text-purple-800"
                        >
                          {event.status === 'completed' ? 'Undo' : 'Complete'}
                        </button>
                        <button
                          onClick={() => onDeleteEvent(event.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dayTasks.length === 0 && dayEvents.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No tasks or events scheduled for this day
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        {renderSelectedDateDetails()}
      </div>

      {view.type === 'month' && renderMonthView()}
      {view.type === 'week' && renderWeekView()}
      {view.type === 'day' && renderDayView()}
    </div>
  );
} 