import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { UserRole } from '@domain/enums/UserRole';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Usuario no autenticado');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('No tienes permiso para acceder a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};