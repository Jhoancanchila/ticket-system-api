/**
 * Value Object para Password
 * Garantiza que la contraseña cumpla con los requisitos
 */
export class Password {
  private readonly value: string;

  constructor(password: string, isHashed: boolean = false) {
    if (!isHashed && !this.isValid(password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    this.value = password;
  }

  private isValid(password: string): boolean {
    return password.length >= 8;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
