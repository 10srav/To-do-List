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
import Messages from '@/components/Messages';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/UserProfile';
import LandingPage from '@/components/LandingPage';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading: authLoading, login, logout, updateUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [calendarView, setCalendarView] = useState<CalendarView>({
    type: 'month',
    currentDate: new Date(),
  });
  const [view, setView] = useState<'list' | 'calendar' | 'messages' | 'profile'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Task | Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading application data...');
        
        // Load tasks and events (now async)
        const [loadedTasks, loadedEvents] = await Promise.all([
          getTasks(),
          getEvents()
        ]);
        
        console.log(`✅ Loaded ${loadedTasks.length} tasks and ${loadedEvents.length} events`);
        
        setTasks(loadedTasks);
        setEvents(loadedEvents);
      } catch (error) {
        console.error('❌ Failed to load data:', error);
        // In case of error, try to load from localStorage as fallback
        try {
          const fallbackTasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]');
          const fallbackEvents = JSON.parse(localStorage.getItem('todo-events') || '[]');
          setTasks(fallbackTasks);
          setEvents(fallbackEvents);
          console.log('📦 Loaded data from localStorage fallback');
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
          // Set empty arrays as last resort
          setTasks([]);
          setEvents([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only load data if user is authenticated
    if (user) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Apply filters when tasks, events, or filters change
  useEffect(() => {
    const filteredTasksData = filterTasks(tasks, filters);
    const filteredEventsData = filterEvents(events, filters);
    
    setFilteredTasks(sortByDate(filteredTasksData));
    setFilteredEvents(sortByDate(filteredEventsData));
  }, [tasks, events, filters]);

  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
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

      console.log('🔄 Adding new task...');
      const savedTask = await addTask(newTask);
      setTasks(prev => [...prev, savedTask]);
      setShowAddModal(false);
      console.log('✅ Task added successfully');
    } catch (error) {
      console.error('❌ Failed to add task:', error);
      // You might want to show an error message to the user here
      alert('Failed to add task. Please try again.');
    }
  };

  const handleAddEvent = async (eventData: Partial<Event>) => {
    try {
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

      console.log('🔄 Adding new event...');
      const savedEvent = await addEvent(newEvent);
      setEvents(prev => [...prev, savedEvent]);
      setShowAddModal(false);
      console.log('✅ Event added successfully');
    } catch (error) {
      console.error('❌ Failed to add event:', error);
      alert('Failed to add event. Please try again.');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingItem(null);
      console.log('✅ Task updated successfully');
    } catch (error) {
      console.error('❌ Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      await updateEvent(updatedEvent);
      setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      setEditingItem(null);
      console.log('✅ Event updated successfully');
    } catch (error) {
      console.error('❌ Failed to update event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      console.log('✅ Task deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      console.log('✅ Event deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
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

  // Show loading spinner while checking authentication
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show landing page if user is not authenticated
  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuthModal(true)} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={login}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        view={view} 
        setView={setView}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        user={user}
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
            ) : view === 'calendar' ? (
              <Calendar
                tasks={tasks}
                events={events}
                view={calendarView}
                onUpdateTask={handleUpdateTask}
                onUpdateEvent={handleUpdateEvent}
                onDeleteTask={handleDeleteTask}
                onDeleteEvent={handleDeleteEvent}
              />
            ) : view === 'messages' ? (
              <Messages />
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <UserProfile
                  user={user}
                  onUpdate={updateUser}
                  onLogout={logout}
                />
              </div>
            )}
          </div>
          
          {view !== 'messages' && view !== 'profile' && <NotificationPanel tasks={tasks} events={events} />}
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