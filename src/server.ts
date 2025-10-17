import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './infrastructure/config/env';
import { connectDatabase } from './infrastructure/database/sequelize/config';
import routes from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares/error-handler.middleware';
import { notFoundHandler } from './infrastructure/http/middlewares/not-found.middleware';

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Routes - Descomentar cuando estén listos los controladores
app.use(`/api/${config.server.apiVersion}`, routes);

// Error handling - Descomentar cuando estén listos los middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(config.server.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor corriendo en puerto ${config.server.port}`);
      // eslint-disable-next-line no-console
      console.log(`Ambiente: ${config.server.env}`);
      // eslint-disable-next-line no-console
      console.log(`API: http://localhost:${config.server.port}/api/${config.server.apiVersion}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
