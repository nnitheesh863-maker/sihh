import http from 'http';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocketServer } from './sockets/socket';
import { config } from './config/config';
import { logger } from './utils/logger';

// ─── Entry Point ──────────────────────────────────────────────────────────────

const bootstrap = async (): Promise<void> => {
  try {
    // Connect to PostgreSQL
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Create HTTP server (needed for Socket.IO)
    const httpServer = http.createServer(app);

    // Initialize Socket.IO
    initializeSocketServer(httpServer);

    // Start listening
    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} [${config.env}]`);
      logger.info(`📖 API Docs: http://localhost:${config.port}/api/docs`);
      logger.info(`🏥 Health:   http://localhost:${config.port}/health`);
    });

    // ── Graceful shutdown ──
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      httpServer.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Unhandled promise rejection safety net
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
