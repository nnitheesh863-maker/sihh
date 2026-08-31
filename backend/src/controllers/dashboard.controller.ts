import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { successResponse } from '../utils/response';

const dashboardService = new DashboardService();

export const getProcurementDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await dashboardService.getProcurementStats();
    res.status(200).json(successResponse(stats));
  } catch (error) {
    next(error);
  }
};

export const getAdminStatistics = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await dashboardService.getAdminStats();
    res.status(200).json(successResponse(stats));
  } catch (error) {
    next(error);
  }
};

export const getAiModels = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const models = dashboardService.getAiModels();
    res.status(200).json(successResponse(models));
  } catch (error) {
    next(error);
  }
};
