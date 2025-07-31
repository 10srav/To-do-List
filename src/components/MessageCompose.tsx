'use client';

import { useState, useRef } from 'react';
import { 
  PaperAirplaneIcon,
  DocumentIcon,
  XMarkIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

interface MessageComposeProps {
  onClose: () => void;
  onSent: () => void;
  replyTo?: {
    messageId: string;
    subject: string;
    from: string;
  };
}

export default function MessageCompose({ onClose, onSent, replyTo }: MessageComposeProps) {
  const [to, setTo] = useState(replyTo?.from || '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const saveDraft = async () => {
    if (!subject.trim() && !body.trim()) return;

    try {
      setSavingDraft(true);
      const messageData = {
        from: 'user@example.com', // This would come from user session
        to: to.split(',').map(email => email.trim()).filter(email => email),
        cc: cc.split(',').map(email => email.trim()).filter(email => email),
        bcc: bcc.split(',').map(email => email.trim()).filter(email => email),
        subject: subject.trim(),
        body: body.trim(),
        priority,
        status: 'draft',
        isHtml: false,
        attachments: attachments.map(file => ({
          filename: file.name,
          size: file.size,
          type: file.type
        }))
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSavingDraft(false);
    }
  };

  const sendMessage = async () => {
    if (!to.trim() || !subject.trim()) {
      alert('Please fill in the recipient and subject fields');
      return;
    }

    try {
      setSending(true);
      const messageData = {
        from: 'user@example.com', // This would come from user session
        to: to.split(',').map(email => email.trim()).filter(email => email),
        cc: cc.split(',').map(email => email.trim()).filter(email => email),
        bcc: bcc.split(',').map(email => email.trim()).filter(email => email),
        subject: subject.trim(),
        body: body.trim(),
        priority,
        isHtml: false,
        attachments: attachments.map(file => ({
          filename: file.name,
          size: file.size,
          type: file.type
        }))
      };

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();

      if (result.success) {
        onSent();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {replyTo ? 'Reply' : 'New Message'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 space-y-4 border-b border-gray-200">
          {/* To Field */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 w-12">To:</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipients (comma separated)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              multiple
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCc(!showCc)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Cc
              </button>
              <button
                onClick={() => setShowBcc(!showBcc)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Bcc
              </button>
            </div>
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 w-12">Cc:</label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="CC recipients (comma separated)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                multiple
              />
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 w-12">Bcc:</label>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="BCC recipients (comma separated)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                multiple
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 w-12">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Attachments:</label>
              <div className="space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DocumentIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Body */}
        <div className="flex-1 p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="w-full h-full resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleAttachment}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <PaperClipIcon className="h-4 w-4" />
              <span>Attach</span>
            </button>
            
            <button
              onClick={saveDraft}
              disabled={savingDraft}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {savingDraft ? 'Saving...' : 'Save Draft'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendMessage}
              disabled={sending || !to.trim() || !subject.trim()}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>{sending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}