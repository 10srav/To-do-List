import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const folder = searchParams.get('folder');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    let query: any = { userId: user.id };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by folder type
    if (folder) {
      switch (folder) {
        case 'inbox':
          query.status = { $in: ['sent', 'draft'] };
          break;
        case 'sent':
          query.status = 'sent';
          break;
        case 'drafts':
          query.status = 'draft';
          break;
        case 'starred':
          query.isStarred = true;
          break;
        case 'important':
          query.isImportant = true;
          break;
        case 'archived':
          query.status = 'archived';
          break;
        case 'trash':
          query.status = 'deleted';
          break;
      }
    }
    
    const skip = (page - 1) * limit;
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Message.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Generate thread ID if not provided
    if (!body.threadId) {
      body.threadId = new Date().getTime().toString();
    }
    
    const message = new Message(body);
    await message.save();
    
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}