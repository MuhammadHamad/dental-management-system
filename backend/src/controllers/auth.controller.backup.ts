import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';

// Simple token generation for development
const generateToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'dental-management-development-secret-key-2024';
  return jwt.sign(payload, secret, {
    expiresIn: '7d'
  });
};

const generateRefreshToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'dental-management-development-secret-key-2024';
  return jwt.sign(payload, secret, {
    expiresIn: '30d'
  });
};

export const signup = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, firstName, lastName, phone, role, clinicName } = req.body;

  // For development mode, skip actual Supabase operations
  if (process.env.NODE_ENV === 'development' && !process.env.SUPABASE_URL?.includes('supabase.co')) {
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

  // Production Supabase operations would go here
  // For now, we'll use a simplified approach
  try {
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError || !authUser.user) {
      throw new CustomError('Failed to create user', 400);
    }

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      phone
    }
  });

  if (authError || !authData.user) {
    throw new CustomError(authError?.message || 'Failed to create user', 400);
  }

  let clinicId: string;

  // If admin, create clinic
  if (role === 'admin') {
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert([{
        name: clinicName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (clinicError || !clinic) {
      // Cleanup: delete the created user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new CustomError('Failed to create clinic', 400);
    }

    clinicId = clinic.id;
  } else {
    // For patients, they need to be assigned to a clinic by an admin
    // For now, we'll create a default clinic or require clinic_id in request
    throw new CustomError('Patient registration requires clinic assignment', 400);
  }

  // Create user profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: authData.user.id,
      clinic_id: clinicId,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

  if (profileError) {
    // Cleanup
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new CustomError('Failed to create user profile', 400);
  }

  // Create user role
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert([{
      user_id: authData.user.id,
      clinic_id: clinicId,
      role,
      created_at: new Date().toISOString()
    }]);

  if (roleError) {
    // Cleanup
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new CustomError('Failed to assign user role', 400);
  }

  // Generate tokens
  const tokenPayload: JWTPayload = {
    userId: authData.user.id,
    email: authData.user.email!,
    role,
    clinicId
  };

  const token = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName,
        lastName,
        role,
        clinicId
      },
      token,
      refreshToken
    }
  });
});

export const signin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  // Sign in with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError || !authData.user) {
    throw new CustomError('Invalid credentials', 401);
  }

  // Get user role and clinic
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role, clinic_id')
    .eq('user_id', authData.user.id)
    .single();

  if (roleError || !userRole) {
    throw new CustomError('User role not found', 403);
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, phone')
    .eq('id', authData.user.id)
    .single();

  // Generate tokens
  const tokenPayload: JWTPayload = {
    userId: authData.user.id,
    email: authData.user.email!,
    role: userRole.role,
    clinicId: userRole.clinic_id
  };

  const token = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.json({
    success: true,
    message: 'Sign in successful',
    data: {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        phone: profile?.phone,
        role: userRole.role,
        clinicId: userRole.clinic_id
      },
      token,
      refreshToken
    }
  });
});

export const signout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Supabase handles token invalidation on client side
  res.json({
    success: true,
    message: 'Signed out successfully'
  });
});

export const forgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`
  });

  if (error) {
    throw new CustomError('Failed to send reset email', 400);
  }

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

export const resetPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { token, password } = req.body;

  // This would typically be handled on the frontend with Supabase
  // Here we're providing a server-side alternative
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    throw new CustomError('Failed to reset password', 400);
  }

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: req.user!.email,
    password: currentPassword
  });

  if (verifyError) {
    throw new CustomError('Current password is incorrect', 400);
  }

  // Update password
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  });

  if (error) {
    throw new CustomError('Failed to update password', 400);
  }

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new CustomError('Profile not found', 404);
  }

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: profile
  });
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { firstName, lastName, phone } = req.body;

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update profile', 400);
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: profile
  });
});

export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new CustomError('Refresh token required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JWTPayload;
    
    // Generate new tokens
    const newTokenPayload: JWTPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      clinicId: decoded.clinicId
    };

    const newToken = generateToken(newTokenPayload);
    const newRefreshToken = generateRefreshToken(newTokenPayload);

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    throw new CustomError('Invalid refresh token', 401);
  }
});
