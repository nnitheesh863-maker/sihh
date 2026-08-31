import { UserRepository } from '../repositories/user.repository';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { ProcurementRepository } from '../repositories/procurement.repository';

export class DashboardService {
  private userRepo: UserRepository;
  private analysisRepo: AnalysisRepository;
  private procurementRepo: ProcurementRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.analysisRepo = new AnalysisRepository();
    this.procurementRepo = new ProcurementRepository();
  }

  async getAdminStats() {
    const stats = await this.analysisRepo.getStatistics();
    const { total: totalUsers } = await this.userRepo.findAll(0, 1);
    return {
      totalUsers,
      totalAnalyses: stats.total,
      recentWeekAnalyses: stats.recentWeek,
      averageScore: stats.avgScore ?? 0,
      gradeDistribution: stats.gradeDistribution.map((g: { grade: string; _count: { grade: number } }) => ({
        grade: g.grade,
        count: g._count.grade,
      })),
    };
  }

  async getProcurementStats() {
    const stats = await this.analysisRepo.getStatistics();
    const { total: totalCenters } = await this.procurementRepo.findAll(0, 1);
    return {
      totalSamples: stats.total,
      totalCenters,
      recentWeek: stats.recentWeek,
      averageScore: Math.round((stats.avgScore ?? 0) * 10) / 10,
      gradeBreakdown: stats.gradeDistribution.map((g: { grade: string; _count: { grade: number } }) => ({
        grade: g.grade,
        count: g._count.grade,
      })),
    };
  }

  getAiModels() {
    return [
      {
        name: 'YOLO11n-onion',
        version: '2.0.0',
        type: 'Disease & Bounding Box Detection',
        accuracy: '96.4%',
        framework: 'Ultralytics PyTorch',
      },
      {
        name: 'EfficientNetB3-quality',
        version: '1.0.0',
        type: 'Quality Classification',
        accuracy: '97.2%',
        framework: 'PyTorch Vision',
      },
      {
        name: 'OpenCV-preprocessor',
        version: '4.9.0',
        type: 'Image Processing & YUV Normalizer',
        accuracy: 'N/A',
        framework: 'OpenCV Headless',
      },
    ];
  }
}
