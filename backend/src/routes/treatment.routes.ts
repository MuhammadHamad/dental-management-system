import { Router } from 'express';
import Joi from 'joi';
import { validateRequest, commonSchemas } from '../middleware/validation.middleware';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import * as treatmentController from '../controllers/treatment.controller';

const router = Router();

// Validation schemas
const createTreatmentSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    durationMinutes: Joi.number().integer().min(15).max(480).default(60),
    price: Joi.number().min(0).precision(2).optional(),
    isActive: Joi.boolean().default(true)
  })
};

const updateTreatmentSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    durationMinutes: Joi.number().integer().min(15).max(480).optional(),
    price: Joi.number().min(0).precision(2).optional(),
    isActive: Joi.boolean().optional()
  })
};

const getTreatmentSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

const getTreatmentsSchema = {
  query: commonSchemas.pagination.keys({
    isActive: Joi.boolean().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional()
  })
};

// Routes - All require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.post('/', validateRequest(createTreatmentSchema), treatmentController.createTreatment);
router.get('/', validateRequest(getTreatmentsSchema), treatmentController.getTreatments);
router.get('/:id', validateRequest(getTreatmentSchema), treatmentController.getTreatmentById);
router.put('/:id', validateRequest(updateTreatmentSchema), treatmentController.updateTreatment);
router.delete('/:id', validateRequest(getTreatmentSchema), treatmentController.deleteTreatment);

export default router;
