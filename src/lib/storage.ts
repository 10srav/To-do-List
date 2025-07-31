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

// Task storage functions
export const getTasks = (): Task[] => {
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

export const addTask = (task: Task): void => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
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

// Event storage functions
export const getEvents = (): Event[] => {
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