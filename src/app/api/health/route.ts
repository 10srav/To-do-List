import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Health check initiated');
    
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
    
    // Test database connection
    let dbStatus = 'disconnected';
    let dbError = null;
    
    try {
      await connectDB();
      dbStatus = 'connected';
      console.log('✅ Database connection successful');
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Unknown database error';
      console.error('❌ Database connection failed:', dbError);
    }
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        error: dbError,
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