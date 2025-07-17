import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { action, username, email, password, profileData } = body;
    
    if (action === 'login') {
      // Login logic
      if (!username && !email) {
        return NextResponse.json(
          { success: false, message: 'Username or email is required' },
          { status: 400 }
        );
      }
      
      if (!password) {
        return NextResponse.json(
          { success: false, message: 'Password is required' },
          { status: 400 }
        );
      }
      
      // Find user by username or email
      const query = username ? { username } : { email };
      const user = await User.findOne(query);
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Check if account is locked
      if (user.isLocked()) {
        return NextResponse.json(
          { success: false, message: 'Account is temporarily locked due to too many failed attempts' },
          { status: 423 }
        );
      }
      
      // Check if account is active
      if (!user.isActive) {
        return NextResponse.json(
          { success: false, message: 'Account is deactivated' },
          { status: 403 }
        );
      }
      
      // Verify password
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        await user.incLoginAttempts();
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }
      
      // Update last login
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          username: user.username,
          agentCode: user.profile.agentCode,
          subscription: user.subscription.type
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          subscription: user.subscription
        }
      });
      
    } else if (action === 'register') {
      // Registration logic
      if (!username || !email || !password) {
        return NextResponse.json(
          { success: false, message: 'Username, email, and password are required' },
          { status: 400 }
        );
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });
      
      if (existingUser) {
        const field = existingUser.username === username ? 'username' : 'email';
        return NextResponse.json(
          { success: false, message: `User with this ${field} already exists` },
          { status: 409 }
        );
      }
      
      // Create new user
      const newUser = new User({
        username,
        email,
        password,
        profile: {
          firstName: profileData?.firstName || '',
          lastName: profileData?.lastName || '',
          division: profileData?.division || 'Intelligence',
          clearanceLevel: profileData?.clearanceLevel || 'CONFIDENTIAL',
          location: profileData?.location || '',
          bio: profileData?.bio || '',
          specialties: profileData?.specialties || []
        }
      });
      
      await newUser.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser._id,
          username: newUser.username,
          agentCode: newUser.profile.agentCode,
          subscription: newUser.subscription.type
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profile: newUser.profile,
          subscription: newUser.subscription
        }
      });
      
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Auth API error:', error);
    
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

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
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
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          subscription: user.subscription
        }
      });
      
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 