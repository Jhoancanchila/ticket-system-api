import bcrypt from 'bcryptjs';
import { IPasswordService } from '@application/ports/services/password.service.interface';

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}