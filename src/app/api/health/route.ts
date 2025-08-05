import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Health check initiated');
    console.log('🔍 Environment info:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION,
    });
    
    // Check environment variables
    const requiredEnvVars = ['MONGODB_URI', 'NEXTAUTH_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      console.error('❌ Missing environment variables:', missingEnvVars);
      return NextResponse.json({
        status: 'error',
        message: 'Missing required environment variables',
        missing: missingEnvVars,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    // Test database connection with detailed logging
    let dbStatus = 'disconnected';
    let dbError: string | null = null;
    let connectionDetails: any = {};
    
    try {
      console.log('🔄 Attempting database connection...');
      const dbStartTime = Date.now();
      
      const mongoose = await Promise.race([
        connectDB(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout after 15 seconds')), 15000)
        )
      ]);
      
      const dbConnectionTime = Date.now() - dbStartTime;
      dbStatus = 'connected';
      
      connectionDetails = {
        connectionTime: `${dbConnectionTime}ms`,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
      };
      
      console.log('✅ Database connection successful:', connectionDetails);
      
      // Test a simple database operation
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        connectionDetails.collections = collections.map(c => c.name);
        console.log('✅ Database collections accessible:', connectionDetails.collections);
      } catch (collError) {
        console.warn('⚠️ Could not list collections:', collError);
        connectionDetails.collectionsError = collError instanceof Error ? collError.message : 'Unknown error';
      }
      
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Unknown database error';
      console.error('❌ Database connection failed:', dbError);
      console.error('❌ Full error:', error);
    }
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: !!process.env.VERCEL,
        VERCEL_URL: process.env.VERCEL_URL,
        VERCEL_REGION: process.env.VERCEL_REGION,
      },
      database: {
        status: dbStatus,
        error: dbError,
        ...connectionDetails,
      },
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };
    
    console.log('✅ Health check completed:', healthData.status);
    
    return NextResponse.json(healthData, {
      status: dbStatus === 'connected' ? 200 : 503,
    });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}