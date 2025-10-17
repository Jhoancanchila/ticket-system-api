import { DomainError } from './DomainError';

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403);
  }
}
