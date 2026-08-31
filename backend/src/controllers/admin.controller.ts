import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/response';

const adminService = new AdminService();

// ─── Admin Controller ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 */
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

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     tags: [Admin]
 *     summary: Get platform statistics (Admin only)
 *     security:
 *       - bearerAuth: []
 */
export const getStatistics = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await adminService.getStatistics();
    res.status(200).json(successResponse(stats));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/admin/models:
 *   get:
 *     tags: [Admin]
 *     summary: Get AI model information (Admin only)
 *     security:
 *       - bearerAuth: []
 */
export const getAiModels = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const models = adminService.getAiModels();
    res.status(200).json(successResponse(models));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/admin/users/{id}/deactivate:
 *   patch:
 *     tags: [Admin]
 *     summary: Deactivate a user account (Admin only)
 *     security:
 *       - bearerAuth: []
 */
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

/**
 * @swagger
 * /api/admin/users/{id}/activate:
 *   patch:
 *     tags: [Admin]
 *     summary: Activate a user account (Admin only)
 *     security:
 *       - bearerAuth: []
 */
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
