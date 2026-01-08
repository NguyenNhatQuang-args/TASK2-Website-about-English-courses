import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

// Create Express app
const createApp = (): Application => {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: config.cors.origin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API routes
  app.use(config.api.prefix, routes);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to the API',
      version: '1.0.0',
      documentation: `${config.api.prefix}/docs`,
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
