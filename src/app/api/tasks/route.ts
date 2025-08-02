import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { getUserFromRequest, createAuthResponse } from '@/lib/auth';

// Enhanced error handler for API routes
function handleApiError(error: unknown, operation: string) {
  console.error(`❌ API Error in ${operation}:`, error);
  
  if (error instanceof Error) {
    // MongoDB connection errors
    if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    // Validation errors
    if (error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided.' },
        { status: 400 }
      );
    }
  }
  
  // Generic error
  return NextResponse.json(
    { success: false, error: `Failed to ${operation.toLowerCase()}` },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/tasks - Fetching tasks');
    
    const user = await getUserFromRequest(request);
    if (!user) {
      console.log('❌ Unauthorized access attempt');
      return createAuthResponse('Unauthorized');
    }

    console.log(`✅ User authenticated: ${user.email}`);
    
    await connectDB();
    console.log('✅ Database connected');
    
    const tasks = await Task.find({ userId: user.id }).sort({ createdAt: -1 });
    console.log(`✅ Found ${tasks.length} tasks for user`);
    
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return handleApiError(error, 'fetch tasks');
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/tasks - Creating task');
    
    const user = await getUserFromRequest(request);
    if (!user) {
      console.log('❌ Unauthorized access attempt');
      return createAuthResponse('Unauthorized');
    }

    console.log(`✅ User authenticated: ${user.email}`);
    
    await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Task data received:', { title: body.title, priority: body.priority });
    
    const task = new Task({ ...body, userId: user.id });
    await task.save();
    
    console.log(`✅ Task created with ID: ${task._id}`);
    
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'create task');
  }
}