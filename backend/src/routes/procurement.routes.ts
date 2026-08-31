import { Router } from 'express';
import {
  getProcurementDashboard,
  getAllAnalyses,
  getProcurementCenters,
  getCentersByDistrict,
} from '../controllers/procurement.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ── Public to all authenticated users ──
router.use(authenticate);

// GET /api/procurement/centers – all authenticated users can see centers
router.get('/centers', getProcurementCenters);

// GET /api/procurement/centers/:district
router.get('/centers/:district', getCentersByDistrict);

// ── Procurement Officer / Admin only ──
router.use(authorize('PROCUREMENT_OFFICER', 'ADMIN'));

// GET /api/procurement/dashboard
router.get('/dashboard', getProcurementDashboard);

// GET /api/procurement/analyses
router.get('/analyses', getAllAnalyses);

export default router;

