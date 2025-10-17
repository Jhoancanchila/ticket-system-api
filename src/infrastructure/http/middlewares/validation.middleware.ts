import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@domain/errors/ValidationError';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validación fallida';
      next(new ValidationError(message));
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validación fallida';
      next(new ValidationError(message));
    }
  };
};