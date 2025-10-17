import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}
