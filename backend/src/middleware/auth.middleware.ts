import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    // For development with placeholder credentials, skip actual verification
    if (process.env.NODE_ENV === 'development' && !process.env.SUPABASE_URL?.includes('supabase.co')) {
      console.warn('⚠️  Development mode: Skipping token verification');
      req.user = {
        id: 'dev-user-id',
        email: 'dev@example.com',
        role: 'admin',
        clinic_id: 'dev-clinic-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      next();
      return;
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'dental-management-development-secret-key-2024';
    const decoded = jwt.verify(token, secret) as any;

    // Verify user exists in Supabase
    const { data: user, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    // Get user role and clinic information
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role, clinic_id')
      .eq('user_id', user.user.id)
      .single();

    if (roleError || !userRole) {
      res.status(403).json({
        success: false,
        message: 'User role not found',
        error: 'FORBIDDEN'
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.user.id,
      email: user.user.email!,
      role: userRole.role,
      clinic_id: userRole.clinic_id,
      created_at: user.user.created_at,
      updated_at: user.user.updated_at || user.user.created_at
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'UNAUTHORIZED'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requirePatient = requireRole(['patient']);
export const requireAnyRole = requireRole(['admin', 'patient']);
