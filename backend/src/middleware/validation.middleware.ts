import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../types';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          });
        });
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `query.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          });
        });
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `params.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          });
        });
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        errors
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  uuid: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  date: Joi.date().iso().required(),
  optionalDate: Joi.date().iso().optional(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};
