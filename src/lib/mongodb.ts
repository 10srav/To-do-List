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
  const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_URL;
  const debugMode = process.env.DEBUG_DB_CONNECTION === 'true' || isVercel;
  
  if (debugMode) {
    console.log('🔍 MongoDB Connection Debug Info:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- NEXT_PHASE:', process.env.NEXT_PHASE);
    console.log('- VERCEL:', isVercel);
    console.log('- VERCEL_URL:', process.env.VERCEL_URL);
    console.log('- MONGODB_URI exists:', !!MONGODB_URI);
    console.log('- MONGODB_URI preview:', MONGODB_URI ? `${MONGODB_URI.substring(0, 30)}...` : 'undefined');
    console.log('- Current cached connection:', !!cached.conn);
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
      maxPoolSize: isVercel ? 3 : 10, // Reduce pool size for Vercel serverless
      serverSelectionTimeoutMS: isVercel ? 15000 : 5000, // Increase timeout for Vercel
      socketTimeoutMS: isVercel ? 45000 : 30000, // Socket timeout
      connectTimeoutMS: isVercel ? 15000 : 5000, // Connection timeout
      heartbeatFrequencyMS: isVercel ? 30000 : 10000, // Heartbeat frequency
      retryWrites: true,
      w: 'majority',
      family: 4
    };

    if (debugMode) {
      console.log('🔄 Creating new MongoDB connection with options:', JSON.stringify(opts, null, 2));
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log('- Connection state:', mongoose.connection.readyState);
      console.log('- Database name:', mongoose.connection.name);
      
      // Add connection event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        // Reset cached promise on error
        cached.promise = null;
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        // Reset cached connection
        cached.conn = null;
        cached.promise = null;
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      console.error('- Error name:', error.name);
      console.error('- Error message:', error.message);
      
      // Reset cached promise on error
      cached.promise = null;
      
      // Provide more specific error messages for common issues
      if (error.message.includes('ENOTFOUND')) {
        throw new Error('MongoDB server not found. Check your connection string and network connectivity.');
      } else if (error.message.includes('authentication failed')) {
        throw new Error('MongoDB authentication failed. Check your username and password.');
      } else if (error.message.includes('timeout')) {
        throw new Error('MongoDB connection timeout. Check your network connectivity.');
      } else if (error.message.includes('ECONNREFUSED')) {
        throw new Error('MongoDB connection refused. Check if MongoDB server is running.');
      }
      
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