import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/farmer.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

// GET /api/farmers/profile
router.get('/profile', getProfile);

// PUT /api/farmers/profile
router.put('/profile', validate(updateProfileSchema), updateProfile);

export default router;
