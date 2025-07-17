import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware to verify JWT token
async function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'User not found or inactive' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      profile: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        subscription: user.subscription,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { profileData } = body;
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'User not found or inactive' },
        { status: 404 }
      );
    }
    
    // Update profile fields
    if (profileData.firstName !== undefined) {
      user.profile.firstName = profileData.firstName;
    }
    if (profileData.lastName !== undefined) {
      user.profile.lastName = profileData.lastName;
    }
    if (profileData.division !== undefined) {
      user.profile.division = profileData.division;
    }
    if (profileData.clearanceLevel !== undefined) {
      user.profile.clearanceLevel = profileData.clearanceLevel;
    }
    if (profileData.location !== undefined) {
      user.profile.location = profileData.location;
    }
    if (profileData.bio !== undefined) {
      user.profile.bio = profileData.bio;
    }
    if (profileData.specialties !== undefined) {
      user.profile.specialties = profileData.specialties;
    }
    if (profileData.avatar !== undefined) {
      user.profile.avatar = profileData.avatar;
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        subscription: user.subscription,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Profile PUT error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Account deactivated successfully'
    });
    
  } catch (error) {
    console.error('Profile DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 