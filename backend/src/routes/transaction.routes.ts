import { Router } from 'express';
import Joi from 'joi';
import { validateRequest, commonSchemas } from '../middleware/validation.middleware';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import * as transactionController from '../controllers/transaction.controller';

const router = Router();

// Validation schemas
const createTransactionSchema = {
  body: Joi.object({
    transactionType: Joi.string().valid('payment', 'refund', 'expense').required(),
    paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'credit_card', 'easypaisa', 'jazzcash', 'insurance').required(),
    amount: Joi.number().min(0).precision(2).required(),
    description: Joi.string().min(2).max(500).required(),
    transactionDate: commonSchemas.date.required(),
    referenceNumber: Joi.string().max(100).optional(),
    patientId: commonSchemas.uuid.optional(),
    appointmentId: commonSchemas.uuid.optional(),
    notes: Joi.string().max(1000).optional()
  })
};

const updateTransactionSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    transactionType: Joi.string().valid('payment', 'refund', 'expense').optional(),
    paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'credit_card', 'easypaisa', 'jazzcash', 'insurance').optional(),
    amount: Joi.number().min(0).precision(2).optional(),
    description: Joi.string().min(2).max(500).optional(),
    transactionDate: commonSchemas.date.optional(),
    referenceNumber: Joi.string().max(100).optional(),
    patientId: commonSchemas.uuid.optional(),
    appointmentId: commonSchemas.uuid.optional(),
    notes: Joi.string().max(1000).optional()
  })
};

const getTransactionSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

const getTransactionsSchema = {
  query: commonSchemas.pagination.keys({
    transactionType: Joi.string().valid('payment', 'refund', 'expense').optional(),
    paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'credit_card', 'easypaisa', 'jazzcash', 'insurance').optional(),
    patientId: commonSchemas.uuid.optional(),
    appointmentId: commonSchemas.uuid.optional(),
    dateFrom: commonSchemas.optionalDate,
    dateTo: commonSchemas.optionalDate,
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(0).optional()
  })
};

// Routes - All require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.post('/', validateRequest(createTransactionSchema), transactionController.createTransaction);
router.get('/', validateRequest(getTransactionsSchema), transactionController.getTransactions);
router.get('/summary', transactionController.getTransactionSummary);
router.get('/reports/daily', transactionController.getDailyReport);
router.get('/reports/monthly', transactionController.getMonthlyReport);
router.get('/:id', validateRequest(getTransactionSchema), transactionController.getTransactionById);
router.put('/:id', validateRequest(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', validateRequest(getTransactionSchema), transactionController.deleteTransaction);

export default router;
