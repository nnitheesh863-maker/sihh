import { Router } from 'express';
import { getHistory, getAnalysisById, deleteAnalysis } from '../controllers/history.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// GET /api/history – paginated user scan history
router.get('/', getHistory);

// GET /api/history/:id
router.get('/:id', getAnalysisById);

// DELETE /api/history/:id
router.delete('/:id', deleteAnalysis);

export default router;
