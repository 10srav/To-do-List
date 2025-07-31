import { format, isToday, isTomorrow, isYesterday, isPast, isFuture, startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { Task, Event, FilterOptions, TodoItem } from '@/types';

// Date utilities
export const formatDate = (date: Date, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(date, formatStr);
};

export const formatTime = (time: string): string => {
  return time;
};

export const getRelativeDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date);
};

export const isOverdue = (date: Date): boolean => {
  return isPast(startOfDay(date));
};

export const isUpcoming = (date: Date): boolean => {
  return isFuture(startOfDay(date));
};

// Priority utilities
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPriorityIcon = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '🔥';
    case 'medium':
      return '⚡';
    case 'low':
      return '💡';
    default:
      return '📝';
  }
};

// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'pending':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Filtering utilities
export const filterTasks = (tasks: Task[], filters: FilterOptions): Task[] => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => task.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Date range filter
    if (filters.dateRange && task.dueDate) {
      const taskDate = startOfDay(task.dueDate);
      const startDate = startOfDay(filters.dateRange.start);
      const endDate = endOfDay(filters.dateRange.end);
      
      if (taskDate < startDate || taskDate > endDate) return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchTerm);
      const matchesDescription = task.description?.toLowerCase().includes(searchTerm) || false;
      const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }

    return true;
  });
};

export const filterEvents = (events: Event[], filters: FilterOptions): Event[] => {
  return events.filter(event => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(event.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(event.priority)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => event.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const eventStart = startOfDay(event.startDate);
      const eventEnd = endOfDay(event.endDate);
      const startDate = startOfDay(filters.dateRange.start);
      const endDate = endOfDay(filters.dateRange.end);
      
      if (eventEnd < startDate || eventStart > endDate) return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(searchTerm);
      const matchesDescription = event.description?.toLowerCase().includes(searchTerm) || false;
      const matchesTags = event.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }

    return true;
  });
};

// Sorting utilities
export const sortByDate = <T extends TodoItem>(items: T[]): T[] => {
  return items.sort((a, b) => {
    const dateA = 'dueDate' in a ? a.dueDate : a.startDate;
    const dateB = 'dueDate' in b ? b.dueDate : b.startDate;
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });
};

export const sortByPriority = <T extends TodoItem>(items: T[]): T[] => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return items.sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const sortByCreated = <T extends TodoItem>(items: T[]): T[] => {
  return items.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

// ID generation
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Tag utilities
export const extractTags = (text: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = text.match(tagRegex);
  return matches ? matches.map(tag => tag.slice(1)) : [];
};

// Notification utilities
export const checkOverdueItems = (tasks: Task[], events: Event[]) => {
  const now = new Date();
  const overdueTasks = tasks.filter(task => 
    task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed'
  );
  
  const overdueEvents = events.filter(event => 
    isPast(event.endDate) && event.status !== 'completed'
  );
  
  return { overdueTasks, overdueEvents };
};

export const checkUpcomingItems = (tasks: Task[], events: Event[]) => {
  const now = new Date();
  const tomorrow = addDays(now, 1);
  
  const upcomingTasks = tasks.filter(task => 
    task.dueDate && 
    task.dueDate >= now && 
    task.dueDate <= tomorrow && 
    task.status !== 'completed'
  );
  
  const upcomingEvents = events.filter(event => 
    event.startDate >= now && 
    event.startDate <= tomorrow && 
    event.status !== 'completed'
  );
  
  return { upcomingTasks, upcomingEvents };
}; 