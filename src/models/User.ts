import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
    language: string;
    timezone: string;
  };
  isEmailVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: { 
    type: String,
    default: ''
  },
  bio: { 
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  preferences: {
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    },
    notifications: { 
      type: Boolean, 
      default: true 
    },
    emailNotifications: { 
      type: Boolean, 
      default: true 
    },
    language: { 
      type: String, 
      default: 'en' 
    },
    timezone: { 
      type: String, 
      default: 'UTC' 
    }
  },
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for better query performance
UserSchema.index({ createdAt: -1 });

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);