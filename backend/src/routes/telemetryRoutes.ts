import { Router, Request, Response } from 'express';
import { TelemetryService } from '../services/telemetryService';

const router = Router();

router.get('/latest', (req: Request, res: Response) => {
  res.status(200).json(TelemetryService.getLatest());
});

router.post('/ingest', (req: Request, res: Response) => {
  const result = TelemetryService.ingest(req.body);
  res.status(201).json(result);
});

export default router;
