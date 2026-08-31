import { Router } from 'express';
import { analyzeOnion, getHistory, getAnalysisById, deleteAnalysis } from '../controllers/analysis.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// All onion routes require authentication
router.use(authenticate);

// POST /api/onions/analyze – upload & grade
router.post('/analyze', upload.single('image'), analyzeOnion);

// GET /api/onions/history
router.get('/history', getHistory);

// GET /api/onions/:id
router.get('/:id', getAnalysisById);

// DELETE /api/onions/:id
router.delete('/:id', deleteAnalysis);

export default router;
