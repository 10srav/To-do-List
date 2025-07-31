import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: string;
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
  comments: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const TaskSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  dueTime: { type: String },
  tags: [{ type: String }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  isRecurring: { type: Boolean, default: false },
  recurrence: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom']
    },
    interval: Number,
    endDate: Date
  },
  isStarred: { type: Boolean, default: false },
  isLiked: { type: Boolean, default: false },
  comments: [{
    id: String,
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);