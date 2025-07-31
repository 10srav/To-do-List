'use client';

import { useState, useEffect } from 'react';
import { Task, Event, FilterOptions, CalendarView } from '@/types';
import { getTasks, getEvents, addTask, addEvent, updateTask, updateEvent, deleteTask, deleteEvent } from '@/lib/storage';
import { filterTasks, filterEvents, sortByDate, sortByPriority, generateId } from '@/lib/utils';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import EventList from '@/components/EventList';
import Calendar from '@/components/Calendar';
import AddItemModal from '@/components/AddItemModal';
import FilterPanel from '@/components/FilterPanel';
import NotificationPanel from '@/components/NotificationPanel';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [calendarView, setCalendarView] = useState<CalendarView>({
    type: 'month',
    currentDate: new Date(),
  });
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Task | Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const loadedTasks = getTasks();
      const loadedEvents = getEvents();
      setTasks(loadedTasks);
      setEvents(loadedEvents);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Apply filters when tasks, events, or filters change
  useEffect(() => {
    const filteredTasksData = filterTasks(tasks, filters);
    const filteredEventsData = filterEvents(events, filters);
    
    setFilteredTasks(sortByDate(filteredTasksData));
    setFilteredEvents(sortByDate(filteredEventsData));
  }, [tasks, events, filters]);

  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title || '',
      description: taskData.description || '',
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      tags: taskData.tags || [],
      priority: taskData.priority || 'medium',
      status: 'pending',
      isRecurring: taskData.isRecurring || false,
      recurrence: taskData.recurrence,
      isStarred: false,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };

    addTask(newTask);
    setTasks(prev => [...prev, newTask]);
    setShowAddModal(false);
  };

  const handleAddEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: generateId(),
      title: eventData.title || '',
      description: eventData.description || '',
      startDate: eventData.startDate || new Date(),
      endDate: eventData.endDate || new Date(),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      tags: eventData.tags || [],
      priority: eventData.priority || 'medium',
      status: 'upcoming',
      isRecurring: eventData.isRecurring || false,
      recurrence: eventData.recurrence,
      isStarred: false,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };

    addEvent(newEvent);
    setEvents(prev => [...prev, newEvent]);
    setShowAddModal(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingItem(null);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    updateEvent(updatedEvent);
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? event : updatedEvent));
    setEditingItem(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleToggleStar = (itemId: string, type: 'task' | 'event') => {
    if (type === 'task') {
      const task = tasks.find(t => t.id === itemId);
      if (task) {
        const updatedTask = { ...task, isStarred: !task.isStarred, updatedAt: new Date() };
        handleUpdateTask(updatedTask);
      }
    } else {
      const event = events.find(e => e.id === itemId);
      if (event) {
        const updatedEvent = { ...event, isStarred: !event.isStarred, updatedAt: new Date() };
        handleUpdateEvent(updatedEvent);
      }
    }
  };

  const handleToggleLike = (itemId: string, type: 'task' | 'event') => {
    if (type === 'task') {
      const task = tasks.find(t => t.id === itemId);
      if (task) {
        const updatedTask = { ...task, isLiked: !task.isLiked, updatedAt: new Date() };
        handleUpdateTask(updatedTask);
      }
    } else {
      const event = events.find(e => e.id === itemId);
      if (event) {
        const updatedEvent = { ...event, isLiked: !event.isLiked, updatedAt: new Date() };
        handleUpdateEvent(updatedEvent);
      }
    }
  };

  const handleStatusChange = (itemId: string, status: string, type: 'task' | 'event') => {
    if (type === 'task') {
      const task = tasks.find(t => t.id === itemId);
      if (task) {
        const updatedTask = { ...task, status: status as any, updatedAt: new Date() };
        handleUpdateTask(updatedTask);
      }
    } else {
      const event = events.find(e => e.id === itemId);
      if (event) {
        const updatedEvent = { ...event, status: status as any, updatedAt: new Date() };
        handleUpdateEvent(updatedEvent);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        view={view} 
        setView={setView}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onAddClick={() => setShowAddModal(true)}
          view={view}
          calendarView={calendarView}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            {view === 'list' ? (
              <>
                <FilterPanel 
                  filters={filters}
                  setFilters={setFilters}
                  tasks={tasks}
                  events={events}
                />
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <TaskList
                    tasks={filteredTasks}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onToggleStar={handleToggleStar}
                    onToggleLike={handleToggleLike}
                    onStatusChange={handleStatusChange}
                    onEdit={setEditingItem}
                  />
                  
                  <EventList
                    events={filteredEvents}
                    onUpdate={handleUpdateEvent}
                    onDelete={handleDeleteEvent}
                    onToggleStar={handleToggleStar}
                    onToggleLike={handleToggleLike}
                    onStatusChange={handleStatusChange}
                    onEdit={setEditingItem}
                  />
                </div>
              </>
            ) : (
              <Calendar
                tasks={tasks}
                events={events}
                view={calendarView}
                onUpdateTask={handleUpdateTask}
                onUpdateEvent={handleUpdateEvent}
                onDeleteTask={handleDeleteTask}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </div>
          
          <NotificationPanel tasks={tasks} events={events} />
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal || !!editingItem}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        onAddTask={handleAddTask}
        onAddEvent={handleAddEvent}
        onUpdateTask={handleUpdateTask}
        onUpdateEvent={handleUpdateEvent}
        editingItem={editingItem}
      />
    </div>
  );
} 