import { Router } from 'express';
import { getProcurementDashboard, getAdminStatistics, getAiModels } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// GET /api/dashboard/procurement
router.get('/procurement', authorize('PROCUREMENT_OFFICER', 'ADMIN'), getProcurementDashboard);

// GET /api/dashboard/admin
router.get('/admin', authorize('ADMIN'), getAdminStatistics);

// GET /api/dashboard/models
router.get('/models', authorize('ADMIN'), getAiModels);

export default router;
