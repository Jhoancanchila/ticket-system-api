import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} no encontrado`, 404);
  }
}
