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
      
      if (response.success && response.data) {
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
        return {
          ...response.data,
          id: response.data._id || response.data.id,
          dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
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

export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasks(tasks);
  }
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(filteredTasks);
};

// Event storage functions with API integration
export const getEvents = async (): Promise<Event[]> => {
  if (shouldUseAPI()) {
    try {
      console.log('🔄 Fetching events from API...');
      const response = await eventAPI.getAll();
      
      if (response.success && response.data) {
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

export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEvent = (updatedEvent: Event): void => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents();
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