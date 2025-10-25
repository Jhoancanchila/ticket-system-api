import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../services/jwt-token.service';
import { SequelizeUserRepository } from '../../database/repositories/sequelize-user.repository';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

const tokenService = new JwtTokenService();
const userRepository = new SequelizeUserRepository();

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.substring(7);
    const payload = tokenService.verifyAccessToken(token);

    // Obtener usuario completo
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    req.user = user;
    next();
  } catch (error) {      
    next(new UnauthorizedError('Token inválido o expirado'));
  }
};