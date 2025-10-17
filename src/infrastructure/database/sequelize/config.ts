import { Sequelize } from 'sequelize';
import { config } from '../../config/env';

export const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Conexión a base de datos establecida');
    
    if (config.server.env === 'development') {
      await sequelize.sync({ alter: true });
      // eslint-disable-next-line no-console
      console.log('Modelos sincronizados');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
};
