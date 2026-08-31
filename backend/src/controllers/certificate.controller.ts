import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { successResponse } from '../utils/response';

const analysisService = new AnalysisService();

// ─── Certificate Controller ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/certificate/{analysisId}:
 *   get:
 *     tags: [Certificates]
 *     summary: Get certificate details by analysis ID
 *     security:
 *       - bearerAuth: []
 */
export const getCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cert = await analysisService.getCertificatePdf(String(req.params.analysisId));
    res.status(200).json(successResponse(cert));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/certificate/{analysisId}/pdf:
 *   get:
 *     tags: [Certificates]
 *     summary: Redirect to downloadable PDF certificate
 *     security:
 *       - bearerAuth: []
 */
export const downloadCertificatePdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cert = await analysisService.getCertificatePdf(String(req.params.analysisId));
    if (cert.pdfUrl) {
      res.redirect(cert.pdfUrl);
    } else {
      res.status(200).json(successResponse(cert));
    }
  } catch (error) {
    next(error);
  }
};
