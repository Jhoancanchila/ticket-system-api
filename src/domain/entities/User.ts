import { UserRole } from '../enums/UserRole';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

/**
 * Entidad User - Representa un usuario del sistema
 * Encapsula la lógica de negocio relacionada con usuarios
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: Password,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Métodos de negocio

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isSupport(): boolean {
    return this.role === UserRole.SUPPORT;
  }

  isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }

  canManageAllTickets(): boolean {
    return this.isAdmin() || this.isSupport();
  }

  canAccessTicket(ticketOwnerId: string): boolean {
    return this.canManageAllTickets() || this.id === ticketOwnerId;
  }

  canViewReports(): boolean {
    return this.isAdmin();
  }

  // Factory method para crear desde datos simples
  static create(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.name,
      new Email(data.email),
      new Password(data.password, true), // Ya está hasheada
      data.role,
      data.createdAt,
      data.updatedAt
    );
  }

  // Convertir a objeto simple para persistencia
  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      password: this.password.getValue(),
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
