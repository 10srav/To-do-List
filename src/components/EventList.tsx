'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { 
  formatDate, 
  getRelativeDate, 
  isOverdue, 
  getPriorityColor, 
  getPriorityIcon,
  getStatusColor 
} from '@/lib/utils';
import { 
  StarIcon, 
  HeartIcon, 
  PencilIcon, 
  TrashIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface EventListProps {
  events: Event[];
  onUpdate: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onToggleStar: (eventId: string, type: 'event') => void;
  onToggleLike: (eventId: string, type: 'event') => void;
  onStatusChange: (eventId: string, status: string, type: 'event') => void;
  onEdit: (event: Event) => void;
}

export default function EventList({ 
  events, 
  onUpdate, 
  onDelete, 
  onToggleStar, 
  onToggleLike, 
  onStatusChange, 
  onEdit 
}: EventListProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CalendarIcon className="h-5 w-5 text-green-600" />;
      case 'ongoing':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'upcoming':
        return <CalendarIcon className="h-5 w-5 text-gray-600" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'ongoing':
        return 'Ongoing';
      case 'upcoming':
        return 'Upcoming';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Upcoming';
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <CalendarIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Create your first event to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Events</h2>
        <span className="text-sm text-gray-500">{events.length} events</span>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={`card transition-all duration-200 hover:shadow-md ${
              event.isStarred ? 'ring-2 ring-yellow-200' : ''
            } ${event.status === 'completed' ? 'opacity-75' : ''}`}
          >
            <div className="flex items-start space-x-4">
              {/* Status Icon */}
              <div className="mt-1 p-1 rounded-full">
                {getStatusIcon(event.status)}
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium text-gray-900 ${
                      event.status === 'completed' ? 'line-through' : ''
                    }`}>
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Tags */}
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Date Range and Priority */}
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1 text-sm">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">
                          {formatDate(event.startDate, 'MMM dd, yyyy')}
                          {event.startTime && ` at ${event.startTime}`}
                          {event.endDate && event.endDate.getTime() !== event.startDate.getTime() && (
                            <>
                              {' - '}
                              {formatDate(event.endDate, 'MMM dd, yyyy')}
                              {event.endTime && ` at ${event.endTime}`}
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{getPriorityIcon(event.priority)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      </div>

                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>

                      {event.isRecurring && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                          🔄 Recurring
                        </span>
                      )}
                    </div>

                    {/* Comments */}
                    {event.comments.length > 0 && (
                      <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        <span>{event.comments.length} comment{event.comments.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onToggleStar(event.id, 'event')}
                      aria-label={event.isStarred ? 'Unstar event' : 'Star event'}
                      className={`p-2 rounded-lg transition-colors ${
                        event.isStarred
                          ? 'text-yellow-600 bg-yellow-50'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      {event.isStarred ? (
                        <StarIconSolid className="h-5 w-5" />
                      ) : (
                        <StarIcon className="h-5 w-5" />
                      )}
                    </button>

                    <button
                      onClick={() => onToggleLike(event.id, 'event')}
                      aria-label={event.isLiked ? 'Unlike event' : 'Like event'}
                      className={`p-2 rounded-lg transition-colors ${
                        event.isLiked
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {event.isLiked ? (
                        <HeartIconSolid className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>

                    <button
                      onClick={() => onEdit(event)}
                      aria-label="Edit event"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => onDelete(event.id)}
                      aria-label="Delete event"
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {expandedEvent === event.id && event.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                    <div className="space-y-2">
                      {event.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expand/Collapse Comments */}
                {event.comments.length > 0 && (
                  <button
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {expandedEvent === event.id ? 'Hide comments' : 'Show comments'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 