import { Request, Response, NextFunction } from 'express';
import { DetectionService } from '../services/detection.service';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const detectionService = new DetectionService();

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

    logger.info(`Starting YOLO11n detection scan for user ${userId}`, {
      filename: req.file.originalname,
      size: req.file.size,
    });

    const result = await detectionService.analyzeOnion(
      userId,
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.status(201).json(successResponse(result, 'Onion analyzed successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cert = await detectionService.getCertificatePdf(String(req.params.analysisId));
    res.status(200).json(successResponse(cert));
  } catch (error) {
    next(error);
  }
};

export const downloadCertificatePdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cert = await detectionService.getCertificatePdf(String(req.params.analysisId));
    if (cert.pdfUrl) {
      res.redirect(cert.pdfUrl);
    } else {
      res.status(200).json(successResponse(cert));
    }
  } catch (error) {
    next(error);
  }
};
