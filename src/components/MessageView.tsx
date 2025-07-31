'use client';

import { useState } from 'react';
import { Message } from '@/types';
import { 
  ArrowLeftIcon,
  StarIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MessageCompose from './MessageCompose';

interface MessageViewProps {
  message: Message;
  onClose: () => void;
  onDelete: () => void;
  onStar: () => void;
}

export default function MessageView({ message, onClose, onDelete, onStar }: MessageViewProps) {
  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (showReply) {
    return (
      <MessageCompose
        onClose={() => setShowReply(false)}
        onSent={() => {
          setShowReply(false);
          onClose();
        }}
        replyTo={{
          messageId: message.id,
          subject: message.subject,
          from: message.from
        }}
      />
    );
  }

  if (showForward) {
    return (
      <MessageCompose
        onClose={() => setShowForward(false)}
        onSent={() => {
          setShowForward(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {message.subject}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onStar}
            className={`p-2 rounded-lg transition-colors ${
              message.isStarred
                ? 'text-yellow-600 bg-yellow-50'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            {message.isStarred ? (
              <StarIconSolid className="h-5 w-5" />
            ) : (
              <StarIcon className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => setShowReply(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowForward(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowUturnRightIcon className="h-5 w-5" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Message Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {message.subject}
                </h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">From:</span> {message.from}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {message.to.join(', ')}
                  </div>
                  {message.cc && message.cc.length > 0 && (
                    <div>
                      <span className="font-medium">CC:</span> {message.cc.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{formatDate(message.createdAt)}</span>
                  {message.sentAt && (
                    <span>Sent: {formatDate(message.sentAt)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {message.priority !== 'normal' && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                    {message.priority === 'high' && <ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />}
                    {message.priority.toUpperCase()} PRIORITY
                  </span>
                )}

                {message.isImportant && (
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                    IMPORTANT
                  </span>
                )}

                {message.labels.map((label) => (
                  <span
                    key={label}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {message.attachments.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Attachments ({message.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {message.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attachment.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className="prose max-w-none">
            {message.isHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: message.body }}
                className="text-gray-900 leading-relaxed"
              />
            ) : (
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                {message.body}
              </div>
            )}
          </div>

          {/* Related Items */}
          {(message.relatedTaskId || message.relatedEventId) && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Related Items
              </h3>
              <div className="text-sm text-blue-700">
                {message.relatedTaskId && (
                  <p>Related to Task: {message.relatedTaskId}</p>
                )}
                {message.relatedEventId && (
                  <p>Related to Event: {message.relatedEventId}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Status: <span className="capitalize">{message.status}</span>
            </span>
            {message.threadId && (
              <span className="text-sm text-gray-500">
                Thread: {message.threadId}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReply(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
              <span>Reply</span>
            </button>

            <button
              onClick={() => setShowForward(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowUturnRightIcon className="h-4 w-4" />
              <span>Forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}