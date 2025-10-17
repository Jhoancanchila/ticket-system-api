import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '@application/ports/services/token.service.interface';
import { config } from '../config/env';

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  }
}