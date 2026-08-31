import { Request, Response, NextFunction } from 'express';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { ProcurementRepository } from '../repositories/procurement.repository';
import { successResponse } from '../utils/response';

const analysisRepo = new AnalysisRepository();
const procurementRepo = new ProcurementRepository();

// ─── Procurement Controller ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/procurement/dashboard:
 *   get:
 *     tags: [Procurement]
 *     summary: Get procurement dashboard overview
 *     security:
 *       - bearerAuth: []
 */
export const getProcurementDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await analysisRepo.getStatistics();
    res.status(200).json(
      successResponse({
        totalSamples: stats.total,
        recentWeek: stats.recentWeek,
        averageScore: Math.round((stats.avgScore ?? 0) * 10) / 10,
        gradeBreakdown: stats.gradeDistribution.map((g: { grade: string; _count: { grade: number } }) => ({
          grade: g.grade,
          count: g._count.grade,
        })),
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/procurement/analyses:
 *   get:
 *     tags: [Procurement]
 *     summary: Get all analyses (Procurement Officer)
 *     security:
 *       - bearerAuth: []
 */
export const getAllAnalyses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) ?? '20', 10);
    const skip = (page - 1) * limit;
    const { analyses, total } = await analysisRepo.findAll(skip, limit);
    res.status(200).json(
      successResponse({
        items: analyses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/procurement/centers:
 *   get:
 *     tags: [Procurement]
 *     summary: List all active procurement centers
 *     security:
 *       - bearerAuth: []
 */
export const getProcurementCenters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '50'), 10);
    const skip = (page - 1) * limit;
    const { centers, total } = await procurementRepo.findAll(skip, limit);
    res.status(200).json(
      successResponse({ items: centers, total, page, limit, totalPages: Math.ceil(total / limit) })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/procurement/centers/{district}:
 *   get:
 *     tags: [Procurement]
 *     summary: Get procurement centers by district
 *     security:
 *       - bearerAuth: []
 */
export const getCentersByDistrict = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const centers = await procurementRepo.findByDistrict(String(req.params.district));
    res.status(200).json(successResponse(centers));
  } catch (error) {
    next(error);
  }
};
