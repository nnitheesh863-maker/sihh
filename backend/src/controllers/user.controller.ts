import { Request, Response, NextFunction } from 'express';
import { FarmerService } from '../services/farmer.service';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/response';

const farmerService = new FarmerService();
const adminService = new AdminService();

export const getProfile = async (
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

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await farmerService.updateProfile(req.user!.userId, req.body);
    res.status(200).json(successResponse(profile, 'Profile updated'));
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const result = await adminService.getAllUsers(page, limit);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await adminService.setUserActive(String(req.params.id), false);
    res.status(200).json(successResponse(result, 'User deactivated'));
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await adminService.setUserActive(String(req.params.id), true);
    res.status(200).json(successResponse(result, 'User activated'));
  } catch (error) {
    next(error);
  }
};
