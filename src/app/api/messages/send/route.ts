import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Update the message status to 'sent' and set sentAt timestamp
    const messageData = {
      ...body,
      status: 'sent',
      sentAt: new Date(),
      updatedAt: new Date()
    };
    
    let message;
    
    // If it's an existing draft, update it
    if (body.id) {
      message = await Message.findByIdAndUpdate(
        body.id,
        messageData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new message
      message = new Message(messageData);
      await message.save();
    }
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}