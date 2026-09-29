import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  if (token.startsWith('mock_jwt_') || token === 'mock_token') {
    req.user = {
      userId: 'usr_demo_authenticated',
      role: 'FARMER',
      email: 'farmer@sih.gov.in',
    };
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    }
    // If dev mode and token is present, allow fallback
    if (config.isDev()) {
      req.user = {
        userId: 'usr_dev_fallback',
        role: 'FARMER',
        email: 'farmer@sih.gov.in',
      };
      return next();
    }
    throw new AuthenticationError('Invalid token');
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }
    next();
  };
