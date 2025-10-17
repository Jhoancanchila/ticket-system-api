/**
 * Puerto (Interface) para el servicio de contraseñas
 */
export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
