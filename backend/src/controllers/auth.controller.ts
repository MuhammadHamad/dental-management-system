import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';

// Simple token generation for development
const generateToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'dental-management-development-secret-key-2024';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const generateRefreshToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'dental-management-development-secret-key-2024';
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// Development-friendly signup
export const signup = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, firstName, lastName, phone, role, clinicName } = req.body;

  // Development mode simulation
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Development mode: Simulating user signup');
    
    const mockUser = {
      id: `dev-user-${Date.now()}`,
      email,
      role: role || 'admin',
      clinic_id: `dev-clinic-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const token = generateToken({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      clinicId: mockUser.clinic_id
    });

    const refreshToken = generateRefreshToken({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      clinicId: mockUser.clinic_id
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully (development mode)',
      data: {
        user: mockUser,
        token,
        refreshToken
      }
    });
    return;
  }

  // Production code would go here
  res.status(501).json({
    success: false,
    message: 'Production signup not implemented yet',
    error: 'NOT_IMPLEMENTED'
  });
});

// Development-friendly signin
export const signin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  // Development mode simulation
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Development mode: Simulating user signin');
    
    const mockUser = {
      id: `dev-user-${Date.now()}`,
      email,
      role: 'admin',
      clinic_id: `dev-clinic-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const token = generateToken({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      clinicId: mockUser.clinic_id
    });

    const refreshToken = generateRefreshToken({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      clinicId: mockUser.clinic_id
    });

    res.json({
      success: true,
      message: 'Sign in successful (development mode)',
      data: {
        user: mockUser,
        token,
        refreshToken
      }
    });
    return;
  }

  // Production code would go here
  res.status(501).json({
    success: false,
    message: 'Production signin not implemented yet',
    error: 'NOT_IMPLEMENTED'
  });
});

// Simple signout
export const signout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Signed out successfully'
  });
});

// Get user profile
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new CustomError('User not authenticated', 401);
  }

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: req.user
  });
});

// Update user profile
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new CustomError('User not authenticated', 401);
  }

  const { firstName, lastName, phone } = req.body;

  // In development, just return updated mock data
  const updatedUser = {
    ...req.user,
    updated_at: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Profile updated successfully (development mode)',
    data: updatedUser
  });
});

// Placeholder for other auth methods
export const forgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Password reset email sent (development mode)'
  });
});

export const resetPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Password reset successfully (development mode)'
  });
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Password changed successfully (development mode)'
  });
});

export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken: oldRefreshToken } = req.body;

  if (!oldRefreshToken) {
    throw new CustomError('Refresh token required', 400);
  }

  // In development, generate new tokens
  const mockPayload = {
    userId: 'dev-user-123',
    email: 'dev@example.com',
    role: 'admin',
    clinicId: 'dev-clinic-123'
  };

  const newToken = generateToken(mockPayload);
  const newRefreshToken = generateRefreshToken(mockPayload);

  res.json({
    success: true,
    message: 'Tokens refreshed successfully (development mode)',
    data: {
      token: newToken,
      refreshToken: newRefreshToken
    }
  });
});
