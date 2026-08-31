import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/schemas';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me – requires authentication
router.get('/me', authenticate, getMe);

export default router;
