import { Router } from 'express';
import { analyzeOnion, getCertificate, downloadCertificatePdf } from '../controllers/detection.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

// POST /api/detection/analyze – upload & YOLO11n scan
router.post('/analyze', upload.single('image'), analyzeOnion);

// GET /api/detection/certificate/:analysisId
router.get('/certificate/:analysisId', getCertificate);

// GET /api/detection/certificate/:analysisId/pdf
router.get('/certificate/:analysisId/pdf', downloadCertificatePdf);

export default router;
