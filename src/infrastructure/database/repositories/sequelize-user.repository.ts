import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { User } from '@domain/entities/User';
import { UserRole } from '@domain/enums/UserRole';
import { UserModel } from '../sequelize/models/user.model';

export class SequelizeUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findByPk(id);
    
    if (!userModel) return null;
    
    return User.create({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      password: userModel.password,
      role: userModel.role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await UserModel.findOne({ where: { email } });
    
    if (!userModel) return null;
    
    return User.create({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      password: userModel.password,
      role: userModel.role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }

  async findAll(filters?: { role?: UserRole }): Promise<User[]> {
    const where: any = {};
    
    if (filters?.role) {
      where.role = filters.role;
    }

    const userModels = await UserModel.findAll({ where });
    
    return userModels.map(userModel =>
      User.create({
        id: userModel.id,
        name: userModel.name,
        email: userModel.email,
        password: userModel.password,
        role: userModel.role,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt
      })
    );
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    await UserModel.update(data as any, { where: { id } });
    const updated = await this.findById(id);
    
    if (!updated) {
      throw new Error('User not found after update');
    }
    
    return updated;
  }

  async delete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async count(): Promise<number> {
    return await UserModel.count();
  }
}