export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Puerto (Interface) para el servicio de tokens JWT
 */
export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
