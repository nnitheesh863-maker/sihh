import http from 'http';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocketServer } from './sockets/socket';
import { config } from './config/env';
import { logger } from './utils/logger';

const bootstrap = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();
    const httpServer = http.createServer(app);

    initializeSocketServer(httpServer);

    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} [${config.env}]`);
      logger.info(`📖 API Docs: http://localhost:${config.port}/api/docs`);
      logger.info(`🏥 Health:   http://localhost:${config.port}/health`);
    });

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
