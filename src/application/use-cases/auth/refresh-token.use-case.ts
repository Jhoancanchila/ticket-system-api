import { ITokenService } from '@application/ports/services/token.service.interface';
import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

/**
 * Caso de Uso: Refresh Token
 * Implementado con programación funcional
 */
export const createRefreshTokenUseCase = (
  tokenService: ITokenService,
  userRepository: IUserRepository
) => {
  return async (refreshToken: string): Promise<{ accessToken: string }> => {
    try {
      // 1. Verificar refresh token
      const payload = tokenService.verifyRefreshToken(refreshToken);

      // 2. Verificar que el usuario aún existe
      const user = await userRepository.findById(payload.userId);
      
      if (!user) {
        throw new UnauthorizedError('Usuario no encontrado');
      }

      // 3. Generar nuevo access token
      const newAccessToken = tokenService.generateAccessToken({
        userId: user.id,
        email: user.email.getValue(),
        role: user.role
      });

      return { accessToken: newAccessToken };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError('Token inválido o expirado');
    }
  };
};

export type RefreshTokenUseCase = ReturnType<typeof createRefreshTokenUseCase>;
