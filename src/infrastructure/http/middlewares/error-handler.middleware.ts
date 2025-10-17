import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/DomainError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof DomainError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
    return;
  }

  // Error desconocido
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
};