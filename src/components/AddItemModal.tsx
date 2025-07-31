'use client';

import { useState, useEffect } from 'react';
import { Task, Event } from '@/types';
import { generateId } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: Partial<Task>) => void;
  onAddEvent: (eventData: Partial<Event>) => void;
  onUpdateTask: (task: Task) => void;
  onUpdateEvent: (event: Event) => void;
  editingItem: Task | Event | null;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onAddTask,
  onAddEvent,
  onUpdateTask,
  onUpdateEvent,
  editingItem
}: AddItemModalProps) {
  const [itemType, setItemType] = useState<'task' | 'event'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  const isEditing = !!editingItem;

  useEffect(() => {
    if (editingItem) {
      setItemType('dueDate' in editingItem ? 'task' : 'event');
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setPriority(editingItem.priority);
      setTags(editingItem.tags);
      setIsRecurring(editingItem.isRecurring);
      
      if (editingItem.recurrence) {
        setRecurrenceType(editingItem.recurrence.type);
        setRecurrenceInterval(editingItem.recurrence.interval);
        setRecurrenceEndDate(editingItem.recurrence.endDate ? 
          editingItem.recurrence.endDate.toISOString().split('T')[0] : '');
      }

      if ('dueDate' in editingItem) {
        // Task
        setDueDate(editingItem.dueDate ? 
          editingItem.dueDate.toISOString().split('T')[0] : '');
        setDueTime(editingItem.dueTime || '');
      } else {
        // Event
        setStartDate(editingItem.startDate.toISOString().split('T')[0]);
        setStartTime(editingItem.startTime || '');
        setEndDate(editingItem.endDate.toISOString().split('T')[0]);
        setEndTime(editingItem.endTime || '');
      }
    } else {
      // Reset form for new item
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setPriority('medium');
      setTags([]);
      setIsRecurring(false);
      setRecurrenceType('weekly');
      setRecurrenceInterval(1);
      setRecurrenceEndDate('');
    }
  }, [editingItem]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const commonData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tags,
      isRecurring,
      recurrence: isRecurring ? {
        type: recurrenceType,
        interval: recurrenceInterval,
        endDate: recurrenceEndDate ? new Date(recurrenceEndDate) : undefined,
      } : undefined,
    };

    if (isEditing) {
      if (itemType === 'task') {
        const updatedTask: Task = {
          ...editingItem as Task,
          ...commonData,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          dueTime: dueTime || undefined,
          updatedAt: new Date(),
        };
        onUpdateTask(updatedTask);
      } else {
        const updatedEvent: Event = {
          ...editingItem as Event,
          ...commonData,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          updatedAt: new Date(),
        };
        onUpdateEvent(updatedEvent);
      }
    } else {
      if (itemType === 'task') {
        onAddTask({
          ...commonData,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          dueTime: dueTime || undefined,
        });
      } else {
        onAddEvent({
          ...commonData,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(),
          startTime: startTime || undefined,
          endTime: endTime || undefined,
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit' : 'Add'} {itemType === 'task' ? 'Task' : 'Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Type Toggle */}
          {!isEditing && (
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setItemType('task')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  itemType === 'task'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Task
              </button>
              <button
                type="button"
                onClick={() => setItemType('event')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  itemType === 'event'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Event
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder={`Enter ${itemType} title`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
              rows={3}
              placeholder={`Enter ${itemType} description`}
            />
          </div>

          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itemType === 'task' ? (
              <>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Time
                  </label>
                  <input
                    type="time"
                    id="dueTime"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="input"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="input"
                  />
                </div>
              </>
            )}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="input flex-1"
                placeholder="Add a tag (press Enter)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recurring Options */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
                Recurring {itemType}
              </label>
            </div>

            {isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                <div>
                  <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    id="recurrenceType"
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value as any)}
                    className="input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="recurrenceInterval" className="block text-sm font-medium text-gray-700 mb-2">
                    Interval
                  </label>
                  <input
                    type="number"
                    id="recurrenceInterval"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(parseInt(e.target.value))}
                    className="input"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="recurrenceEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="recurrenceEndDate"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {isEditing ? 'Update' : 'Create'} {itemType === 'task' ? 'Task' : 'Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 