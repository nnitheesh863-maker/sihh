import { Router, Request, Response } from 'express';
import { ExportService } from '../services/exportService';

const router = Router();

router.get('/batch/:id/csv', (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || '');
  const dummyBatch = {
    batchId: paramId,
    batchCode: 'BATCH-2026-NASHIK-001',
    farmerName: 'Ramesh Patil',
    date: new Date().toISOString().split('T')[0],
    totalOnions: 1250,
    gradeA: 680,
    gradeB: 390,
    gradeC: 120,
    rejects: 60,
    averageDiameterMm: 54.5,
    estimatedWeightKg: 106.2,
    defectsBreakdown: {
      'Skin Crack': 85,
      'Sun Scald': 42,
      'Black Mold': 35,
      'Sprouting': 25
    }
  };

  const csv = ExportService.generateCSV(dummyBatch);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=batch-${paramId}.csv`);
  res.status(200).send(csv);
});

export default router;
