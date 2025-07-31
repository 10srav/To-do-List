import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  userId: string;
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
  comments: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const EventSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  tags: [{ type: String }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
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

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);