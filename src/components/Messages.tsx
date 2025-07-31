'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types';
import { 
  InboxIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MessageCompose from './MessageCompose';
import MessageView from './MessageView';

interface MessagesProps {
  onClose?: () => void;
}

export default function Messages({ onClose }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: InboxIcon, count: 0 },
    { id: 'sent', name: 'Sent', icon: PaperAirplaneIcon, count: 0 },
    { id: 'drafts', name: 'Drafts', icon: DocumentIcon, count: 0 },
    { id: 'starred', name: 'Starred', icon: StarIcon, count: 0 },
    { id: 'important', name: 'Important', icon: ExclamationTriangleIcon, count: 0 },
    { id: 'archived', name: 'Archived', icon: ArchiveBoxIcon, count: 0 },
    { id: 'trash', name: 'Trash', icon: TrashIcon, count: 0 },
  ];

  useEffect(() => {
    fetchMessages();
  }, [selectedFolder]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?folder=${selectedFolder}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      } else {
        console.error('Failed to fetch messages:', data.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleStarToggle = async (messageId: string, isStarred: boolean) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isStarred: !isStarred }),
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isStarred: !isStarred } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (showCompose) {
    return (
      <MessageCompose
        onClose={() => setShowCompose(false)}
        onSent={() => {
          setShowCompose(false);
          fetchMessages();
        }}
      />
    );
  }

  if (selectedMessage) {
    return (
      <MessageView
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onDelete={() => handleDeleteMessage(selectedMessage.id)}
        onStar={() => handleStarToggle(selectedMessage.id, selectedMessage.isStarred)}
      />
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span>Compose</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {selectedFolder}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="mt-4 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <InboxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No messages found
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'Your inbox is empty'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !message.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarToggle(message.id, message.isStarred);
                      }}
                      className="mt-1 text-gray-400 hover:text-yellow-500"
                    >
                      {message.isStarred ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <StarIcon className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${!message.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                          {selectedFolder === 'sent' ? `To: ${message.to.join(', ')}` : message.from}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                      
                      <p className={`text-sm ${!message.isRead ? 'font-medium' : ''} text-gray-900 truncate mt-1`}>
                        {message.subject}
                      </p>
                      
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {message.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>

                      {message.attachments.length > 0 && (
                        <div className="flex items-center mt-2">
                          <DocumentIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {message.priority === 'high' && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}