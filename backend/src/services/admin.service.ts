import { UserRepository } from '../repositories/user.repository';
import { AnalysisRepository } from '../repositories/analysis.repository';

// ─── Admin Service ────────────────────────────────────────────────────────────

export class AdminService {
  private userRepo: UserRepository;
  private analysisRepo: AnalysisRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.analysisRepo = new AnalysisRepository();
  }

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { users, total } = await this.userRepo.findAll(skip, limit);
    const safeUsers = users.map(({ password: _, ...u }) => u);
    return {
      items: safeUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStatistics() {
    const stats = await this.analysisRepo.getStatistics();
    return {
      totalAnalyses: stats.total,
      recentWeekAnalyses: stats.recentWeek,
      averageScore: stats.avgScore ?? 0,
      gradeDistribution: stats.gradeDistribution.map((g: { grade: string; _count: { grade: number } }) => ({
        grade: g.grade,
        count: g._count.grade,
      })),
    };
  }

  getAiModels() {
    return [
      {
        name: 'YOLOv8n-onion',
        version: '1.0.0',
        type: 'Defect Detection',
        accuracy: '94.2%',
        framework: 'Ultralytics',
      },
      {
        name: 'EfficientNetB3-quality',
        version: '1.0.0',
        type: 'Quality Classification',
        accuracy: '96.1%',
        framework: 'PyTorch',
      },
      {
        name: 'OpenCV-preprocessor',
        version: '4.8.0',
        type: 'Image Processing',
        accuracy: 'N/A',
        framework: 'OpenCV',
      },
    ];
  }

  async setUserActive(userId: string, isActive: boolean) {
    const user = await this.userRepo.update(userId, { isActive });
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
