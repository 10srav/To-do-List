import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Database connection test started');
    
    // Get MongoDB URI
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI environment variable is not set',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    console.log('🔍 MongoDB URI preview:', MONGODB_URI.substring(0, 30) + '...');
    
    // Test direct connection without caching
    const connectionOptions = {
      bufferCommands: false,
      maxPoolSize: 3,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      heartbeatFrequencyMS: 30000,
      retryWrites: true,
      w: 'majority',
      family: 4
    };
    
    console.log('🔄 Attempting direct MongoDB connection...');
    
    // Create a new connection for testing
    const testConnection = await mongoose.createConnection(MONGODB_URI, connectionOptions);
    
    const connectionTime = Date.now() - startTime;
    
    // Test database operations
    const dbInfo = {
      connectionTime: `${connectionTime}ms`,
      readyState: testConnection.readyState,
      host: testConnection.host,
      port: testConnection.port,
      name: testConnection.name,
    };
    
    console.log('✅ Direct connection successful:', dbInfo);
    
    // Test listing collections
    let collections: string[] = [];
    try {
      const collectionList = await testConnection.db.listCollections().toArray();
      collections = collectionList.map(c => c.name);
      console.log('✅ Collections found:', collections);
    } catch (collError) {
      console.warn('⚠️ Could not list collections:', collError);
    }
    
    // Test creating a simple document
    let testWrite = false;
    try {
      const TestModel = testConnection.model('HealthTest', new mongoose.Schema({
        timestamp: Date,
        test: String
      }));
      
      const testDoc = new TestModel({
        timestamp: new Date(),
        test: 'connection-test'
      });
      
      await testDoc.save();
      await TestModel.deleteOne({ _id: testDoc._id });
      testWrite = true;
      console.log('✅ Write test successful');
    } catch (writeError) {
      console.warn('⚠️ Write test failed:', writeError);
    }
    
    // Close test connection
    await testConnection.close();
    
    const totalTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test completed',
      results: {
        ...dbInfo,
        totalTime: `${totalTime}ms`,
        collections,
        writeTest: testWrite,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: !!process.env.VERCEL,
          VERCEL_URL: process.env.VERCEL_URL,
          VERCEL_REGION: process.env.VERCEL_REGION,
        }
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Database connection test failed',
      details: {
        name: error.name,
        code: error.code,
        totalTime: `${totalTime}ms`,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: !!process.env.VERCEL,
          VERCEL_URL: process.env.VERCEL_URL,
          VERCEL_REGION: process.env.VERCEL_REGION,
        }
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}