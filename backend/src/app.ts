import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import { config } from './config/env';
import { swaggerSpec } from './docs/swagger';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// ── New Modular Routes ──
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import detectionRoutes from './routes/detection.routes';
import historyRoutes from './routes/history.routes';
import dashboardRoutes from './routes/dashboard.routes';

// ── Aliased Routes for Full Backward Compatibility ──
// Removed in architecture cleanup

export const createApp = (): Application => {
  const app = express();

  // ── Security middleware ──
  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.origin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ── Rate limiting ──
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests, please try again later.',
    },
  });
  app.use(limiter);

  // ── Request parsing ──
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── Static Files (Local fallback for S3) ──
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // ── HTTP request logging ──
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    })
  );

  // ── Health check ──
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        service: 'SIH26031 YOLO11 Onion Grading API',
      },
    });
  });

  // ── API Documentation ──
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Onion Grading API Docs',
    })
  );

  // ── API Routes ──
  const API = '/api';

  // Primary modular routes
  app.use(`${API}/auth`, authRoutes);
  app.use(`${API}/user`, userRoutes);
  app.use(`${API}/detection`, detectionRoutes);
  app.use(`${API}/history`, historyRoutes);
  app.use(`${API}/dashboard`, dashboardRoutes);

  // Backward compatibility alias routes
  // Removed in architecture cleanup

  // ── 404 handler ──
  app.use(notFoundHandler);

  // ── Global error handler ──
  app.use(errorHandler);

  return app;
};
