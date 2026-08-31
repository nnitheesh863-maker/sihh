import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// ─── Certificate Repository ───────────────────────────────────────────────────

export class CertificateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  generateCertificateNumber(): string {
    const prefix = 'OGC';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).toUpperCase().substring(2, 8);
    return `${prefix}-${year}-${random}`;
  }

  async create(data: {
    analysisId: string;
    userId: string;
    qrCode?: string;
    pdfUrl?: string;
  }) {
    return this.prisma.certificate.create({
      data: {
        ...data,
        certificateNumber: this.generateCertificateNumber(),
      },
    });
  }

  async findById(id: string) {
    return this.prisma.certificate.findUnique({
      where: { id },
      include: {
        analysis: {
          include: { defects: true },
        },
        user: { select: { name: true, email: true, phone: true, village: true, district: true } },
      },
    });
  }

  async findByAnalysisId(analysisId: string) {
    return this.prisma.certificate.findUnique({ where: { analysisId } });
  }

  async update(id: string, data: { qrCode?: string; pdfUrl?: string }) {
    return this.prisma.certificate.update({ where: { id }, data });
  }
}
