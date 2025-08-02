import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  // Skip connection during build time or if no MongoDB URI is provided
  const MONGODB_URI = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
  const debugMode = process.env.DEBUG_DB_CONNECTION === 'true';
  
  if (debugMode) {
    console.log('🔍 MongoDB Connection Debug Info:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- NEXT_PHASE:', process.env.NEXT_PHASE);
    console.log('- MONGODB_URI exists:', !!MONGODB_URI);
    console.log('- MONGODB_URI preview:', MONGODB_URI ? `${MONGODB_URI.substring(0, 20)}...` : 'undefined');
  }
  
  if (!MONGODB_URI) {
    const errorMsg = `MongoDB URI is not defined. Please set MONGODB_URI environment variable.`;
    
    // During build time, just return mongoose without connecting
    if (isBuildTime) {
      console.warn('⚠️ MongoDB connection skipped during build process - no MONGODB_URI provided');
      return mongoose;
    }
    
    console.error('❌ MongoDB Connection Error:', errorMsg);
    throw new Error(errorMsg);
  }

  // Return existing connection if available
  if (cached.conn) {
    if (debugMode) {
      console.log('✅ Using existing MongoDB connection');
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    if (debugMode) {
      console.log('🔄 Creating new MongoDB connection...');
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      
      // Add connection event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    
    if (debugMode) {
      console.log('✅ MongoDB connection established and cached');
    }
    
  } catch (error) {
    cached.promise = null;
    console.error('❌ Failed to establish MongoDB connection:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        throw new Error('MongoDB server not found. Please check your connection string and network connectivity.');
      } else if (error.message.includes('authentication failed')) {
        throw new Error('MongoDB authentication failed. Please check your username and password.');
      } else if (error.message.includes('timeout')) {
        throw new Error('MongoDB connection timeout. Please check your network connectivity and server status.');
      }
    }
    
    throw error;
  }

  return cached.conn;
}

export default connectDB;