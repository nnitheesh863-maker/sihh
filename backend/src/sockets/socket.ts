import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from '../config/config';
import { logger } from '../utils/logger';

// ─── Socket.IO Setup ──────────────────────────────────────────────────────────

let io: SocketServer;

export const initializeSocketServer = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.cors.origin,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join a personal room keyed by userId
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      logger.info(`Socket ${socket.id} joined room user:${userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emit analysis progress updates to a specific user's room
 */
export const emitAnalysisUpdate = (
  userId: string,
  event: string,
  data: unknown
): void => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export { io };
