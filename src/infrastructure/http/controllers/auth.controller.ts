import { Request, Response, NextFunction } from 'express';
import { createLoginUseCase } from '@application/use-cases/auth/login.use-case';
import { createRefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { SequelizeUserRepository } from '../../database/repositories/sequelize-user.repository';
import { JwtTokenService } from '../../services/jwt-token.service';
import { BcryptPasswordService } from '../../services/bcrypt-password.service';

const userRepository = new SequelizeUserRepository();
const tokenService = new JwtTokenService();
const passwordService = new BcryptPasswordService();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginUseCase = createLoginUseCase(
        userRepository,
        tokenService,
        passwordService
      );

      const result = await loginUseCase(req.body);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshTokenUseCase = createRefreshTokenUseCase(
        tokenService,
        userRepository
      );

      const result = await refreshTokenUseCase(req.body.refreshToken);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}