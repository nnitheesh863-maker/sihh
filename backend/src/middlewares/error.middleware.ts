import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

// ─── Global Error Handler Middleware ─────────────────────────────────────────

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Log the error
  logger.error({
    message: err.message,
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Operational error (expected, like validation, auth, not-found)
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      errorResponse(err.message, err.errors)
    );
    return;
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string };
    if (prismaErr.code === 'P2002') {
      res.status(409).json(errorResponse('A record with this value already exists'));
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json(errorResponse('Record not found'));
      return;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(errorResponse('Invalid token'));
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json(errorResponse('Token expired'));
    return;
  }

  // Unknown / programming errors – don't leak internals in production
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json(
    errorResponse(
      'Internal server error',
      isDev ? [err.message, err.stack] : undefined
    )
  );
};

// ─── 404 Catch-all ───────────────────────────────────────────────────────────

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};
