import { sequelize } from '../infrastructure/database/sequelize/config';
import { UserModel } from '../infrastructure/database/sequelize/models/user.model';
import { BcryptPasswordService } from '../infrastructure/services/bcrypt-password.service';
import { UserRole } from '../domain/enums/UserRole';

const passwordService = new BcryptPasswordService();

const users = [
  {
    name: 'Administrador',
    email: 'admin@test.com',
    password: 'admin123',
    role: UserRole.ADMIN
  },
  {
    name: 'Soporte Técnico',
    email: 'soporte@test.com',
    password: 'soporte123',
    role: UserRole.SUPPORT
  },
  {
    name: 'Cliente Juan',
    email: 'juan@test.com',
    password: 'juan123',
    role: UserRole.CLIENT
  },
  {
    name: 'Cliente María',
    email: 'maria@test.com',
    password: 'maria123',
    role: UserRole.CLIENT
  },
  {
    name: 'cliente Luis',
    email: 'luis@test.com',
    password: 'luis123',
    role: UserRole.CLIENT
  },
  {
    name: 'Cliente Pedro',
    email: 'pedro@test.com',
    password: 'pedro123',
    role: UserRole.CLIENT
  }
];

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');

    await sequelize.sync({ force: true });
    console.log('Modelos sincronizados');

    for (const user of users) {
      const hashedPassword = await passwordService.hash(user.password);
      
      await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      });

      console.log(`Usuario creado: ${user.email}`);
    }

    console.log('Seed completado exitosamente');
    console.log('Usuarios de prueba:');
    users.forEach(u => {
      console.log(`  - ${u.email} / ${u.password} (${u.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seedUsers();