import { Sequelize } from 'sequelize';
import { config } from '../../config/env';

// Configuración para Neon (PostgreSQL en la nube) o local
const sequelizeConfig = config.database.url
  ? {
      // Usar URL de conexión completa (Neon, Railway, etc.)
      url: config.database.url,
      dialect: 'postgres' as const,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Necesario para Neon
        }
      },
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  : {
      // Usar configuración individual (Docker local)
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      username: config.database.user,
      password: config.database.password,
      dialect: 'postgres' as const,
      dialectOptions: config.database.ssl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };

export const sequelize = config.database.url
  ? new Sequelize(config.database.url, sequelizeConfig)
  : new Sequelize(sequelizeConfig);

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
