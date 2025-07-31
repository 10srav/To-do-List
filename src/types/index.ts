export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  dueTime?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  isRecurring: boolean;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: Date;
  };
  isStarred: boolean;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: Date;
  };
  isStarred: boolean;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterOptions {
  status?: string[];
  priority?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day';
  currentDate: Date;
}

export type TodoItem = Task | Event;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: Date;
  isRead: boolean;
  relatedItemId?: string;
}

export interface Message {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml: boolean;
  priority: 'low' | 'normal' | 'high';
  status: 'draft' | 'sent' | 'archived' | 'deleted';
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels: string[];
  attachments: {
    filename: string;
    size: number;
    type: string;
    url?: string;
  }[];
  relatedTaskId?: string;
  relatedEventId?: string;
  threadId?: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
}