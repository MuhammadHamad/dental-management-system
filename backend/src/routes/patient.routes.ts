import { Router } from 'express';
import Joi from 'joi';
import { validateRequest, commonSchemas } from '../middleware/validation.middleware';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import * as patientController from '../controllers/patient.controller';

const router = Router();

// Validation schemas
const createPatientSchema = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    dateOfBirth: Joi.date().iso().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().max(500).optional(),
    emergencyContactName: Joi.string().max(100).optional(),
    emergencyContactPhone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    medicalHistory: Joi.string().max(2000).optional(),
    allergies: Joi.string().max(1000).optional(),
    insuranceProvider: Joi.string().max(100).optional(),
    insuranceNumber: Joi.string().max(100).optional()
  })
};

const updatePatientSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    dateOfBirth: Joi.date().iso().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().max(500).optional(),
    emergencyContactName: Joi.string().max(100).optional(),
    emergencyContactPhone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    medicalHistory: Joi.string().max(2000).optional(),
    allergies: Joi.string().max(1000).optional(),
    insuranceProvider: Joi.string().max(100).optional(),
    insuranceNumber: Joi.string().max(100).optional()
  })
};

const getPatientSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

const getPatientsSchema = {
  query: commonSchemas.pagination.keys({
    status: Joi.string().valid('active', 'inactive').optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional()
  })
};

// Routes - All require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.post('/', validateRequest(createPatientSchema), patientController.createPatient);
router.get('/', validateRequest(getPatientsSchema), patientController.getPatients);
router.get('/:id', validateRequest(getPatientSchema), patientController.getPatientById);
router.put('/:id', validateRequest(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', validateRequest(getPatientSchema), patientController.deletePatient);
router.get('/:id/appointments', validateRequest(getPatientSchema), patientController.getPatientAppointments);
router.get('/:id/transactions', validateRequest(getPatientSchema), patientController.getPatientTransactions);

export default router;
