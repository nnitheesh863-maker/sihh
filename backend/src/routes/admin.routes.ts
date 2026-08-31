import { Router } from 'express';
import {
  getAllUsers,
  getStatistics,
  getAiModels,
  deactivateUser,
  activateUser,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

// GET /api/admin/users
router.get('/users', getAllUsers);

// GET /api/admin/statistics
router.get('/statistics', getStatistics);

// GET /api/admin/models
router.get('/models', getAiModels);

// PATCH /api/admin/users/:id/deactivate
router.patch('/users/:id/deactivate', deactivateUser);

// PATCH /api/admin/users/:id/activate
router.patch('/users/:id/activate', activateUser);

export default router;
