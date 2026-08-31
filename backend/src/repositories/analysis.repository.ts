import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../config/database';

// ─── Analysis Repository ──────────────────────────────────────────────────────

type Grade = 'A' | 'B' | 'C' | 'REJECTED';
type FreshnessLevel = 'HIGH' | 'MEDIUM' | 'LOW';
type DamageLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type RecommendationStatus = 'ACCEPT' | 'CONDITIONAL_ACCEPT' | 'REJECT';

export class AnalysisRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async create(data: {
    userId: string;
    imageUrl: string;
    processedImageUrl?: string;
    grade: Grade;
    score: number;
    size: string;
    freshness: FreshnessLevel;
    damageLevel: DamageLevel;
    recommendation: RecommendationStatus;
    aiModelVersion?: string;
    processingTimeMs?: number;
    defects: {
      defectType: string;
      diseaseName?: string;
      confidence: number;
      areaPercentage?: number;
      severity?: string;
      treatment?: string;
      storageAdvice?: string;
      xMin?: number;
      yMin?: number;
      xMax?: number;
      yMax?: number;
    }[];
  }) {
    const { defects, ...analysisData } = data;
    return this.prisma.onionAnalysis.create({
      data: {
        ...analysisData,
        defects: {
          create: defects.map((d) => ({
            defectType: d.defectType,
            diseaseName: d.diseaseName,
            confidence: d.confidence,
            areaPercentage: d.areaPercentage,
            severity: d.severity,
            treatment: d.treatment,
            storageAdvice: d.storageAdvice,
            xMin: d.xMin,
            yMin: d.yMin,
            xMax: d.xMax,
            yMax: d.yMax,
          })),
        },
      },
      include: { defects: true },
    });
  }

  async findById(id: string) {
    return this.prisma.onionAnalysis.findUnique({
      where: { id },
      include: { defects: true, certificate: true, user: { select: { name: true, email: true } } },
    });
  }

  async findByUserId(userId: string, skip = 0, take = 10) {
    const [analyses, total] = await this.prisma.$transaction([
      this.prisma.onionAnalysis.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { defects: true, certificate: { select: { certificateNumber: true } } },
      }),
      this.prisma.onionAnalysis.count({ where: { userId } }),
    ]);
    return { analyses, total };
  }

  async findAll(skip = 0, take = 20) {
    const [analyses, total] = await this.prisma.$transaction([
      this.prisma.onionAnalysis.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          defects: true,
          user: { select: { name: true, email: true, village: true, district: true } },
          certificate: { select: { certificateNumber: true } },
        },
      }),
      this.prisma.onionAnalysis.count(),
    ]);
    return { analyses, total };
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.onionAnalysis.delete({ where: { id } });
  }

  async getStatistics() {
    const [total, gradeDistribution, avgScore, recentWeek] =
      await this.prisma.$transaction([
        this.prisma.onionAnalysis.count(),
        this.prisma.onionAnalysis.groupBy({
          by: ['grade'],
          _count: { grade: true },
        }),
        this.prisma.onionAnalysis.aggregate({ _avg: { score: true } }),
        this.prisma.onionAnalysis.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        }),
      ]);

    return { total, gradeDistribution, avgScore: avgScore._avg.score, recentWeek };
  }
}
