import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: number;
    env: string;
    apiVersion: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  nodemailer: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
    fromEmailPassword: string;
  };
  cors: {
    origin: string;
  };
}

export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'ticket_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  nodemailer: {
    apiKey: process.env.NODEMAILER_API_KEY as string,
    fromEmail: process.env.FROM_EMAIL as string,
    fromName: process.env.FROM_NAME as string,
    fromEmailPassword: process.env.FROM_EMAIL_PASSWORD as string,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  }
};
