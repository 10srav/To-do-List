import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  userId: string;
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

const MessageSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  from: { type: String, required: true },
  to: [{ type: String, required: true }],
  cc: [{ type: String }],
  bcc: [{ type: String }],
  subject: { type: String, required: true },
  body: { type: String, required: true },
  isHtml: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  status: { type: String, enum: ['draft', 'sent', 'archived', 'deleted'], default: 'draft' },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false },
  labels: [{ type: String }],
  attachments: [{
    filename: String,
    size: Number,
    type: String,
    url: String
  }],
  relatedTaskId: { type: String },
  relatedEventId: { type: String },
  threadId: { type: String },
  sentAt: { type: Date }
}, {
  timestamps: true
});

// Index for better query performance
MessageSchema.index({ from: 1, createdAt: -1 });
MessageSchema.index({ to: 1, createdAt: -1 });
MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ threadId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);