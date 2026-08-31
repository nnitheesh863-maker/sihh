import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/config';
import { swaggerSpec } from './docs/swagger';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// ── Routes ──
import authRoutes from './routes/auth.routes';
import analysisRoutes from './routes/analysis.routes';
import farmerRoutes from './routes/farmer.routes';
import certificateRoutes from './routes/certificate.routes';
import adminRoutes from './routes/admin.routes';
import procurementRoutes from './routes/procurement.routes';

// ─── Express App Factory ──────────────────────────────────────────────────────

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

  // ── HTTP request logging ──
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    })
  );

  // ── Health check (no auth) ──
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'SIH26031 Onion Grading API',
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
  app.use(`${API}/auth`, authRoutes);
  app.use(`${API}/onions`, analysisRoutes);
  app.use(`${API}/farmers`, farmerRoutes);
  app.use(`${API}/certificate`, certificateRoutes);
  app.use(`${API}/admin`, adminRoutes);
  app.use(`${API}/procurement`, procurementRoutes);

  // ── 404 handler ──
  app.use(notFoundHandler);

  // ── Global error handler ──
  app.use(errorHandler);

  return app;
};
