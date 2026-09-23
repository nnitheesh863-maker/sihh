import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error({
    message: err.message,
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    const code = (err as any).code || err.name.replace('Error', '').toUpperCase() + '_ERROR';
    res.status(err.statusCode).json(
      errorResponse(err.message, code, err.errors)
    );
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; message: string };
    if (prismaErr.code === 'P2002') {
      res.status(409).json(errorResponse('A record with this value already exists', 'DATABASE_CONFLICT_ERROR'));
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json(errorResponse('Record not found', 'DATABASE_NOT_FOUND_ERROR'));
      return;
    }
    if (prismaErr.code === 'P1001') {
      res.status(503).json(errorResponse('Cannot connect to the database. Please verify your connection settings.', 'DATABASE_CONNECTION_ERROR'));
      return;
    }
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(errorResponse('Invalid token', 'INVALID_TOKEN_ERROR'));
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json(errorResponse('Token expired', 'TOKEN_EXPIRED_ERROR'));
    return;
  }

  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json(
    errorResponse(
      'Internal server error',
      'INTERNAL_SERVER_ERROR',
      isDev ? [err.message, err.stack] : undefined
    )
  );
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};
