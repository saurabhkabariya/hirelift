import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

/**
 * JWT Authentication middleware for API routes
 * @param {Request} request - Next.js request object
 * @returns {Object} - User object and decoded token
 */
export async function authenticateToken(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new Error('Access token required');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token payload');
    }

    // Connect to database and get user
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is verified
    if (!user.emailVerified) {
      throw new Error('Email not verified');
    }

    return {
      user,
      token: decoded
    };
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    throw error;
  }
}

/**
 * Higher-order function to wrap API route handlers with authentication
 * @param {Function} handler - API route handler function
 * @returns {Function} - Wrapped handler with authentication
 */
export function withAuth(handler) {
  return async function(request, context) {
    try {
      const auth = await authenticateToken(request);
      
      // Add auth data to request context
      request.auth = auth;
      
      return await handler(request, context);
    } catch (error) {
      const statusCode = getErrorStatusCode(error.message);
      return NextResponse.json(
        { 
          error: error.message,
          code: 'AUTHENTICATION_ERROR' 
        },
        { status: statusCode }
      );
    }
  };
}

/**
 * Get appropriate HTTP status code for authentication errors
 * @param {string} errorMessage - Error message
 * @returns {number} - HTTP status code
 */
function getErrorStatusCode(errorMessage) {
  if (errorMessage.includes('required') || errorMessage.includes('Access token')) {
    return 401; // Unauthorized
  }
  if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
    return 401; // Unauthorized
  }
  if (errorMessage.includes('not verified')) {
    return 403; // Forbidden
  }
  if (errorMessage.includes('not found')) {
    return 404; // Not Found
  }
  return 500; // Internal Server Error
}

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @param {string} expiresIn - Token expiration time
 * @returns {string} - JWT token
 */
export function generateToken(user, expiresIn = '7d') {
  return jwt.sign(
    { 
      userId: user._id.toString(),
      email: user.email,
      isPremium: user.isPremium || false
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

/**
 * Verify and decode JWT token without database lookup
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract user ID from JWT token
 * @param {Request} request - Next.js request object
 * @returns {string|null} - User ID or null if not found
 */
export function getUserIdFromToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has premium access
 * @param {Object} user - User object
 * @returns {boolean} - True if user has premium access
 */
export function hasPremiumAccess(user) {
  return user && (user.isPremium === true);
}

/**
 * Middleware to check premium access
 * @param {Function} handler - API route handler
 * @returns {Function} - Wrapped handler with premium check
 */
export function withPremium(handler) {
  return withAuth(async function(request, context) {
    const { user } = request.auth;
    
    if (!hasPremiumAccess(user)) {
      return NextResponse.json(
        { 
          error: 'Premium subscription required',
          code: 'PREMIUM_REQUIRED' 
        },
        { status: 403 }
      );
    }
    
    return await handler(request, context);
  });
}

export default {
  authenticateToken,
  withAuth,
  withPremium,
  generateToken,
  verifyToken,
  getUserIdFromToken,
  hasPremiumAccess
};
