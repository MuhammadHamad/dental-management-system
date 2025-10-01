import { Router } from 'express';
import Joi from 'joi';
import { validateRequest, commonSchemas } from '../middleware/validation.middleware';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import * as inventoryController from '../controllers/inventory.controller';

const router = Router();

// Validation schemas
const createInventorySchema = {
  body: Joi.object({
    itemName: Joi.string().min(2).max(100).required(),
    category: Joi.string().min(2).max(50).required(),
    brand: Joi.string().max(50).optional(),
    supplier: Joi.string().max(100).optional(),
    currentStock: Joi.number().integer().min(0).required(),
    minimumStock: Joi.number().integer().min(0).required(),
    unitCost: Joi.number().min(0).precision(2).optional(),
    expiryDate: commonSchemas.optionalDate,
    notes: Joi.string().max(500).optional()
  })
};

const updateInventorySchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    itemName: Joi.string().min(2).max(100).optional(),
    category: Joi.string().min(2).max(50).optional(),
    brand: Joi.string().max(50).optional(),
    supplier: Joi.string().max(100).optional(),
    currentStock: Joi.number().integer().min(0).optional(),
    minimumStock: Joi.number().integer().min(0).optional(),
    unitCost: Joi.number().min(0).precision(2).optional(),
    expiryDate: commonSchemas.optionalDate,
    notes: Joi.string().max(500).optional()
  })
};

const getInventorySchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

const getInventoryItemsSchema = {
  query: commonSchemas.pagination.keys({
    category: Joi.string().optional(),
    lowStock: Joi.boolean().optional(),
    expiringSoon: Joi.boolean().optional(),
    brand: Joi.string().optional(),
    supplier: Joi.string().optional()
  })
};

const updateStockSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  body: Joi.object({
    quantity: Joi.number().integer().required(),
    type: Joi.string().valid('add', 'subtract', 'set').required(),
    notes: Joi.string().max(500).optional()
  })
};

// Routes - All require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.post('/', validateRequest(createInventorySchema), inventoryController.createInventoryItem);
router.get('/', validateRequest(getInventoryItemsSchema), inventoryController.getInventoryItems);
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/expiring', inventoryController.getExpiringItems);
router.get('/categories', inventoryController.getCategories);
router.get('/:id', validateRequest(getInventorySchema), inventoryController.getInventoryItemById);
router.put('/:id', validateRequest(updateInventorySchema), inventoryController.updateInventoryItem);
router.patch('/:id/stock', validateRequest(updateStockSchema), inventoryController.updateStock);
router.delete('/:id', validateRequest(getInventorySchema), inventoryController.deleteInventoryItem);

export default router;
