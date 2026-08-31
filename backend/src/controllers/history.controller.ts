import { Request, Response, NextFunction } from 'express';
import { DetectionService } from '../services/detection.service';
import { successResponse } from '../utils/response';

const detectionService = new DetectionService();

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '10'), 10);
    const result = await detectionService.getHistory(userId, page, limit);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const analysis = await detectionService.getAnalysisById(String(req.params.id));
    res.status(200).json(successResponse(analysis));
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await detectionService.deleteAnalysis(String(req.params.id), req.user!.userId);
    res.status(200).json(successResponse(null, 'Analysis deleted'));
  } catch (error) {
    next(error);
  }
};
