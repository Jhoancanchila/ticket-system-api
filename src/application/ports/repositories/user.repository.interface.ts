import { User } from '@domain/entities/User';
import { UserRole } from '@domain/enums/UserRole';

/**
 * Puerto (Interface) para el repositorio de usuarios
 * Define el contrato que debe cumplir cualquier implementación
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: { role?: UserRole }): Promise<User[]>;
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}