import { Router } from 'express';
import Joi from 'joi';
import { validateRequest, commonSchemas } from '../middleware/validation.middleware';
import { authenticateToken, requireAdmin, requireAnyRole } from '../middleware/auth.middleware';
import * as appointmentController from '../controllers/appointment.controller';

const router = Router();

// Validation schemas
const createAppointmentSchema = {
  body: Joi.object({
    patientId: commonSchemas.uuid.required(),
    dentistId: commonSchemas.uuid.optional(),
    appointmentDate: commonSchemas.date.required(),
    appointmentTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    durationMinutes: Joi.number().integer().min(15).max(480).default(60),
    notes: Joi.string().max(1000).optional(),
    treatmentIds: Joi.array().items(commonSchemas.uuid).optional()
  })
};

const updateAppointmentSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    patientId: commonSchemas.uuid.optional(),
    dentistId: commonSchemas.uuid.optional(),
    appointmentDate: commonSchemas.date.optional(),
    appointmentTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    durationMinutes: Joi.number().integer().min(15).max(480).optional(),
    status: Joi.string().valid('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show').optional(),
    notes: Joi.string().max(1000).optional(),
    diagnosis: Joi.string().max(2000).optional(),
    treatmentPlan: Joi.string().max(2000).optional(),
    treatmentIds: Joi.array().items(commonSchemas.uuid).optional()
  })
};

const getAppointmentSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

const getAppointmentsSchema = {
  query: commonSchemas.pagination.keys({
    status: Joi.string().valid('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show').optional(),
    patientId: commonSchemas.uuid.optional(),
    dentistId: commonSchemas.uuid.optional(),
    dateFrom: commonSchemas.optionalDate,
    dateTo: commonSchemas.optionalDate
  })
};

const updateStatusSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    status: Joi.string().valid('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show').required(),
    notes: Joi.string().max(1000).optional()
  })
};

// Routes
router.use(authenticateToken);

// Admin only routes
router.post('/', requireAdmin, validateRequest(createAppointmentSchema), appointmentController.createAppointment);
router.get('/', requireAdmin, validateRequest(getAppointmentsSchema), appointmentController.getAppointments);
router.put('/:id', requireAdmin, validateRequest(updateAppointmentSchema), appointmentController.updateAppointment);
router.delete('/:id', requireAdmin, validateRequest(getAppointmentSchema), appointmentController.deleteAppointment);
router.patch('/:id/status', requireAdmin, validateRequest(updateStatusSchema), appointmentController.updateAppointmentStatus);

// Both admin and patient can access
router.get('/:id', requireAnyRole, validateRequest(getAppointmentSchema), appointmentController.getAppointmentById);

// Patient specific routes
router.get('/patient/my-appointments', requireAnyRole, appointmentController.getMyAppointments);

// Public appointment booking (for website)
router.post('/book', validateRequest(createAppointmentSchema), appointmentController.bookAppointment);

export default router;
