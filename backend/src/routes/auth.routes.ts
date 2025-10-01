import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Validation schemas
const signupSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    role: Joi.string().valid('admin', 'patient').default('patient'),
    clinicName: Joi.string().min(2).max(100).when('role', {
      is: 'admin',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  })
};

const signinSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required()
  })
};

const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required()
  })
};

const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
  })
};

// Routes
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/signin', validateRequest(signinSchema), authController.signin);
router.post('/signout', authController.signout);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), authController.changePassword);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/refresh-token', authController.refreshToken);

export default router;
