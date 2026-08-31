import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const analysisService = new AnalysisService();

// ─── Onion Analysis Controller ────────────────────────────────────────────────

/**
 * @swagger
 * /api/onions/analyze:
 *   post:
 *     tags: [Analysis]
 *     summary: Upload onion image for AI grading
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Analysis complete with grade and certificate
 *       400:
 *         description: No image uploaded or invalid file
 */
export const analyzeOnion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an onion image', 400);
    }

    const userId = req.user!.userId;

    logger.info(`Starting onion analysis for user ${userId}`, {
      filename: req.file.originalname,
      size: req.file.size,
    });

    let contextData = null;
    if (req.body.context) {
      try {
        contextData = JSON.parse(req.body.context);
      } catch (e) {
        logger.warn('Failed to parse context data', { error: e });
      }
    }

    const result = await analysisService.analyzeOnion(
      userId,
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname,
      contextData
    );

    res.status(201).json(successResponse(result, 'Onion graded successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/onions/history:
 *   get:
 *     tags: [Analysis]
 *     summary: Get user's analysis history
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
 *           default: 10
 */
export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '10'), 10);
    const result = await analysisService.getHistory(userId, page, limit);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/onions/{id}:
 *   get:
 *     tags: [Analysis]
 *     summary: Get analysis by ID
 *     security:
 *       - bearerAuth: []
 */
export const getAnalysisById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const analysis = await analysisService.getAnalysisById(String(req.params.id));
    res.status(200).json(successResponse(analysis));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/onions/{id}:
 *   delete:
 *     tags: [Analysis]
 *     summary: Delete an analysis record
 *     security:
 *       - bearerAuth: []
 */
export const deleteAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await analysisService.deleteAnalysis(String(req.params.id), req.user!.userId);
    res.status(200).json(successResponse(null, 'Analysis deleted'));
  } catch (error) {
    next(error);
  }
};
