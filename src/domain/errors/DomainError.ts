/**
 * Error base del dominio
 * Todos los errores de negocio heredan de esta clase
 */
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
