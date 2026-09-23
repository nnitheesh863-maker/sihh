import { Request, Response } from 'express';
import { MandiPriceService } from '../services/mandiPriceService';
import { TelemetryService } from '../services/telemetryService';

export class AnalyticsController {
  public static getDashboardOverview(req: Request, res: Response): void {
    const mandiPrices = MandiPriceService.getLivePrices();
    const telemetry = TelemetryService.getLatest();

    res.status(200).json({
      summary: {
        totalBatchesSorted: 142,
        totalOnionsGraded: 185200,
        totalWeightKg: 14816,
        averageQualityScore: 84.6,
        gradeDistribution: {
          gradeA: 54.2,
          gradeB: 31.8,
          gradeC: 9.5,
          rejects: 4.5
        }
      },
      telemetry,
      mandiPrices,
      topDefectsFrequency: [
        { defect: 'Skin Crack', count: 4820, percentage: 48.2 },
        { defect: 'Minor Sun Scald', count: 2150, percentage: 21.5 },
        { defect: 'Sprouting', count: 1840, percentage: 18.4 },
        { defect: 'Black Mold', count: 710, percentage: 7.1 },
        { defect: 'Neck Rot', count: 480, percentage: 4.8 }
      ]
    });
  }
}
