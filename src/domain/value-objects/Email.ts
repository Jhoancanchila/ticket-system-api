/**
 * Value Object para Email
 * Garantiza que el email siempre sea válido
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!this.isValid(trimmedEmail)) {
      throw new Error('Email inválido');
    }
    
    this.value = trimmedEmail;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
