import { Request, Response, NextFunction } from 'express';
import { FarmerService } from '../services/farmer.service';
import { successResponse } from '../utils/response';

const farmerService = new FarmerService();

// ─── Farmer Controller ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/farmers/profile:
 *   get:
 *     tags: [Farmers]
 *     summary: Get farmer profile
 *     security:
 *       - bearerAuth: []
 */
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

/**
 * @swagger
 * /api/farmers/profile:
 *   put:
 *     tags: [Farmers]
 *     summary: Update farmer profile
 *     security:
 *       - bearerAuth: []
 */
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
