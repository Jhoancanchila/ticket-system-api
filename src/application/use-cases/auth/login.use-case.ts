import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { ITokenService } from '@application/ports/services/token.service.interface';
import { IPasswordService } from '@application/ports/services/password.service.interface';
import { LoginDTO, LoginResponseDTO } from '@application/dtos/auth/login.dto';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

export const createLoginUseCase = (
  userRepository: IUserRepository,
  tokenService: ITokenService,
  passwordService: IPasswordService
) => {
  return async (loginData: LoginDTO): Promise<LoginResponseDTO> => {
    // 1. Buscar usuario
    const user = await userRepository.findByEmail(loginData.email);
    
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // 2. Verificar contraseña
    const isPasswordValid = await passwordService.compare(
      loginData.password,
      user.password.getValue()
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // 3. Generar tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email.getValue(),
      role: user.role
    };

    const accessToken = tokenService.generateAccessToken(tokenPayload);
    const refreshToken = tokenService.generateRefreshToken(tokenPayload);

    // 4. Retornar respuesta
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.getValue(),
        role: user.role
      },
      accessToken,
      refreshToken
    };
  };
};

export type LoginUseCase = ReturnType<typeof createLoginUseCase>;
