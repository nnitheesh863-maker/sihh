import { Router } from 'express';
import { getCertificate, downloadCertificatePdf } from '../controllers/certificate.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// GET /api/certificate/:analysisId
router.get('/:analysisId', getCertificate);

// GET /api/certificate/:analysisId/pdf
router.get('/:analysisId/pdf', downloadCertificatePdf);

export default router;
