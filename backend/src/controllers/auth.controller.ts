import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { FarmerService } from '../services/farmer.service';
import { successResponse } from '../utils/response';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const authService = new AuthService();
const farmerService = new FarmerService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json(successResponse(result, 'Registration successful'));
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body as LoginInput);
    res.status(200).json(successResponse(result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body as { refreshToken: string };
    const tokens = await authService.refreshTokens(token);
    res.status(200).json(successResponse(tokens, 'Tokens refreshed'));
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body as { refreshToken: string };
    await authService.logout(token);
    res.status(200).json(successResponse(null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await farmerService.getProfile(req.user!.userId);
    res.status(200).json(successResponse(profile));
  } catch (error) {
    next(error);
  }
};
