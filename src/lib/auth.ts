import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function createAuthResponse(error: string, status: number = 401) {
  return Response.json(
    { success: false, error },
    { status }
  );
}