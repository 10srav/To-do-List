'use client';

import { useState } from 'react';
import { Task } from '@/types';
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
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStar: (taskId: string, type: 'task') => void;
  onToggleLike: (taskId: string, type: 'task') => void;
  onStatusChange: (taskId: string, status: string, type: 'task') => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ 
  tasks, 
  onUpdate, 
  onDelete, 
  onToggleStar, 
  onToggleLike, 
  onStatusChange, 
  onEdit 
}: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <CheckCircleIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <span className="text-sm text-gray-500">{tasks.length} tasks</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`card transition-all duration-200 hover:shadow-md ${
              task.isStarred ? 'ring-2 ring-yellow-200' : ''
            } ${task.status === 'completed' ? 'opacity-75' : ''}`}
          >
            <div className="flex items-start space-x-4">
              {/* Status Checkbox */}
                             <button
                 onClick={() => onStatusChange(
                   task.id, 
                   task.status === 'completed' ? 'pending' : 'completed', 
                   'task'
                 )}
                 aria-label={task.status === 'completed' ? 'Mark task as pending' : 'Mark task as completed'}
                 className={`mt-1 p-1 rounded-full transition-colors ${
                   task.status === 'completed' 
                     ? 'text-green-600 bg-green-50' 
                     : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 <CheckCircleIcon className="h-5 w-5" />
               </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium text-gray-900 ${
                      task.status === 'completed' ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Due Date and Priority */}
                    <div className="flex items-center space-x-4 mt-3">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className={`${
                            isOverdue(task.dueDate) && task.status !== 'completed'
                              ? 'text-red-600 font-medium'
                              : 'text-gray-500'
                          }`}>
                            {getRelativeDate(task.dueDate)}
                            {task.dueTime && ` at ${task.dueTime}`}
                          </span>
                          {isOverdue(task.dueDate) && task.status !== 'completed' && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{getPriorityIcon(task.priority)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>

                      {task.isRecurring && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                          🔄 Recurring
                        </span>
                      )}
                    </div>

                    {/* Comments */}
                    {task.comments.length > 0 && (
                      <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onToggleStar(task.id, 'task')}
                      className={`p-2 rounded-lg transition-colors ${
                        task.isStarred
                          ? 'text-yellow-600 bg-yellow-50'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      {task.isStarred ? (
                        <StarIconSolid className="h-5 w-5" />
                      ) : (
                        <StarIcon className="h-5 w-5" />
                      )}
                    </button>

                    <button
                      onClick={() => onToggleLike(task.id, 'task')}
                      className={`p-2 rounded-lg transition-colors ${
                        task.isLiked
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {task.isLiked ? (
                        <HeartIconSolid className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>

                                         <button
                       onClick={() => onEdit(task)}
                       aria-label="Edit task"
                       className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                     >
                       <PencilIcon className="h-5 w-5" />
                     </button>

                     <button
                       onClick={() => onDelete(task.id)}
                       aria-label="Delete task"
                       className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                     >
                       <TrashIcon className="h-5 w-5" />
                     </button>
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {expandedTask === task.id && task.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                    <div className="space-y-2">
                      {task.comments.map((comment) => (
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
                {task.comments.length > 0 && (
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {expandedTask === task.id ? 'Hide comments' : 'Show comments'}
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