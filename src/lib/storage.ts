import { Task, Event, Comment, Notification } from '@/types';
import { taskAPI, eventAPI } from './api';

const STORAGE_KEYS = {
  TASKS: 'todo-tasks',
  EVENTS: 'todo-events',
  NOTIFICATIONS: 'todo-notifications',
  SETTINGS: 'todo-settings',
} as const;

// Check if we should use API (when MongoDB is connected) or localStorage
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true' || false;

// Helper function to determine if we should use API
const shouldUseAPI = (): boolean => {
  // Always use API in production if configured
  if (process.env.NODE_ENV === 'production' && USE_API) {
    return true;
  }
  
  // In development, use API if explicitly enabled
  return USE_API;
};

// Enhanced error handling for API operations
const handleStorageError = (operation: string, error: unknown) => {
  console.error(`❌ Storage error in ${operation}:`, error);
  
  // If API fails, we could fallback to localStorage in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ API failed, falling back to localStorage');
    return false; // Indicates fallback needed
  }
  
  throw error; // Re-throw in production
};

// Generic storage functions
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// Task storage functions with API integration
export const getTasks = async (): Promise<Task[]> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Fetching tasks from API...');
      const response = await taskAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`✅ Fetched ${response.data.length} tasks from API`);
        return response.data.map((task: any) => ({
          ...task,
          id: task._id || task.id,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          comments: task.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
          })) || [],
        }));
      } else {
        console.error('❌ Failed to fetch tasks from API:', response.error);
        throw new Error(response.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      if (handleStorageError('getTasks', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        return getTasksFromStorage();
      }
      throw error;
    }
  }
  
  return getTasksFromStorage();
};

// Separate function for localStorage operations
const getTasksFromStorage = (): Task[] => {
  const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS);
  return tasks.map(task => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    comments: task.comments.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    })),
  }));
};

export const saveTasks = (tasks: Task[]): void => {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
};

export const addTask = async (task: Task): Promise<Task> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Creating task via API...');
      const response = await taskAPI.create(task);
      
      if (response.success && response.data) {
        console.log('✅ Task created via API');
        const taskData = response.data as any;
        return {
          ...taskData,
          id: taskData._id || taskData.id,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
          createdAt: new Date(taskData.createdAt),
          updatedAt: new Date(taskData.updatedAt),
        };
      } else {
        console.error('❌ Failed to create task via API:', response.error);
        throw new Error(response.error || 'Failed to create task');
      }
    } catch (error) {
      if (handleStorageError('addTask', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        const tasks = getTasksFromStorage();
        tasks.push(task);
        saveTasks(tasks);
        return task;
      }
      throw error;
    }
  }
  
  // localStorage implementation
  const tasks = getTasksFromStorage();
  tasks.push(task);
  saveTasks(tasks);
  return task;
};

export const updateTask = async (updatedTask: Task): Promise<void> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Updating task via API...');
      const response = await taskAPI.update(updatedTask.id, updatedTask);
      
      if (response.success) {
        console.log('✅ Task updated via API');
        return;
      } else {
        console.error('❌ Failed to update task via API:', response.error);
        throw new Error(response.error || 'Failed to update task');
      }
    } catch (error) {
      if (handleStorageError('updateTask', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        const tasks = getTasksFromStorage();
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          tasks[index] = updatedTask;
          saveTasks(tasks);
        }
        return;
      }
      throw error;
    }
  }
  
  // localStorage implementation
  const tasks = getTasksFromStorage();
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasks(tasks);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Deleting task via API...');
      const response = await taskAPI.delete(taskId);
      
      if (response.success) {
        console.log('✅ Task deleted via API');
        return;
      } else {
        console.error('❌ Failed to delete task via API:', response.error);
        throw new Error(response.error || 'Failed to delete task');
      }
    } catch (error) {
      if (handleStorageError('deleteTask', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        const tasks = getTasksFromStorage();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        saveTasks(filteredTasks);
        return;
      }
      throw error;
    }
  }
  
  // localStorage implementation
  const tasks = getTasksFromStorage();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(filteredTasks);
};

// Event storage functions with API integration
export const getEvents = async (): Promise<Event[]> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Fetching events from API...');
      const response = await eventAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`✅ Fetched ${response.data.length} events from API`);
        return response.data.map((event: any) => ({
          ...event,
          id: event._id || event.id,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
          comments: event.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
          })) || [],
        }));
      } else {
        console.error('❌ Failed to fetch events from API:', response.error);
        throw new Error(response.error || 'Failed to fetch events');
      }
    } catch (error) {
      if (handleStorageError('getEvents', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        return getEventsFromStorage();
      }
      throw error;
    }
  }
  
  return getEventsFromStorage();
};

// Separate function for localStorage operations
const getEventsFromStorage = (): Event[] => {
  const events = getFromStorage<Event>(STORAGE_KEYS.EVENTS);
  return events.map(event => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    createdAt: new Date(event.createdAt),
    updatedAt: new Date(event.updatedAt),
    comments: event.comments.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    })),
  }));
};

export const saveEvents = (events: Event[]): void => {
  saveToStorage(STORAGE_KEYS.EVENTS, events);
};

export const addEvent = async (event: Event): Promise<Event> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Creating event via API...');
      const response = await eventAPI.create(event);
      
      if (response.success && response.data) {
        console.log('✅ Event created via API');
        const eventData = response.data as any;
        return {
          ...eventData,
          id: eventData._id || eventData.id,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
          createdAt: new Date(eventData.createdAt),
          updatedAt: new Date(eventData.updatedAt),
        };
      } else {
        console.error('❌ Failed to create event via API:', response.error);
        throw new Error(response.error || 'Failed to create event');
      }
    } catch (error) {
      if (handleStorageError('addEvent', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        const events = getEventsFromStorage();
        events.push(event);
        saveEvents(events);
        return event;
      }
      throw error;
    }
  }
  
  // localStorage implementation
  const events = getEventsFromStorage();
  events.push(event);
  saveEvents(events);
  return event;
};

export const updateEvent = async (updatedEvent: Event): Promise<void> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Updating event via API...');
      const response = await eventAPI.update(updatedEvent.id, updatedEvent);
      
      if (response.success) {
        console.log('✅ Event updated via API');
        return;
      } else {
        console.error('❌ Failed to update event via API:', response.error);
        throw new Error(response.error || 'Failed to update event');
      }
    } catch (error) {
      if (handleStorageError('updateEvent', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        const events = getEventsFromStorage();
        const index = events.findIndex(event => event.id === updatedEvent.id);
        if (index !== -1) {
          events[index] = updatedEvent;
          saveEvents(events);
        }
        return;
      }
      throw error;
    }
  }
  
  // localStorage implementation
  const events = getEventsFromStorage();
  const index = events.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Deleting event via API...');
      const response = await eventAPI.delete(eventId);
      
      if (response.success) {
        console.log('✅ Event deleted via API');
        return;
      } else {
        console.error('❌ Failed to delete event via API:', response.error);
        throw new Error(response.error || 'Failed to delete event');
      }
    } catch (error) {
      if (handleStorageError('deleteEvent', error) === false) {
        // Fallback to localStorage in development
        console.log('📦 Using localStorage fallback');
        const events = getEventsFromStorage();
        const filteredEvents = events.filter(event => event.id !== eventId);
        saveEvents(filteredEvents);
        return;
      }
      throw error;
    }
  }
  
  // localStorage implementation
  const events = getEventsFromStorage();
  const filteredEvents = events.filter(event => event.id !== eventId);
  saveEvents(filteredEvents);
};

// Notification storage functions
export const getNotifications = (): Notification[] => {
  const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  return notifications.map(notification => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
  }));
};

export const saveNotifications = (notifications: Notification[]): void => {
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

export const addNotification = (notification: Notification): void => {
  const notifications = getNotifications();
  notifications.push(notification);
  saveNotifications(notifications);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].isRead = true;
    saveNotifications(notifications);
  }
};

export const clearNotifications = (): void => {
  saveNotifications([]);
};

// Settings storage
export const getSettings = () => {
  if (typeof window === 'undefined') return {};
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
    return {};
  }
};

export const saveSettings = (settings: any): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}; 