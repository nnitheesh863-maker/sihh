import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers, deactivateUser, activateUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/auth.validator';

const router = Router();

router.use(authenticate);

// GET /api/user/profile
router.get('/profile', getProfile);

// PUT /api/user/profile
router.put('/profile', validate(updateProfileSchema), updateProfile);

// Admin-only endpoints
router.get('/admin/all', authorize('ADMIN'), getAllUsers);
router.patch('/admin/:id/deactivate', authorize('ADMIN'), deactivateUser);
router.patch('/admin/:id/activate', authorize('ADMIN'), activateUser);

export default router;
