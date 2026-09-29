import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const localCerts: Map<string, any> = new Map();

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
    const certificateNumber = this.generateCertificateNumber();
    const certRecord = {
      id: `cert_${Date.now()}`,
      certificateNumber,
      createdAt: new Date(),
      ...data,
    };
    localCerts.set(data.analysisId, certRecord);
    localCerts.set(certRecord.id, certRecord);

    try {
      return await this.prisma.certificate.create({
        data: {
          ...data,
          certificateNumber,
        },
      });
    } catch {
      return certRecord as any;
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.certificate.findUnique({
        where: { id },
        include: {
          analysis: {
            include: { defects: true },
          },
          user: { select: { name: true, email: true, phone: true, village: true, district: true } },
        },
      });
    } catch {
      return localCerts.get(id) || null;
    }
  }

  async findByAnalysisId(analysisId: string) {
    try {
      const res = await this.prisma.certificate.findUnique({ where: { analysisId } });
      if (res) return res;
    } catch {}
    return localCerts.get(analysisId) || {
      id: `cert_${analysisId}`,
      analysisId,
      certificateNumber: `OGC-${analysisId.slice(0, 8).toUpperCase()}`,
      pdfUrl: '',
      createdAt: new Date(),
    };
  }

  async update(id: string, data: { qrCode?: string; pdfUrl?: string }) {
    try {
      return await this.prisma.certificate.update({ where: { id }, data });
    } catch {
      const rec = localCerts.get(id);
      if (rec) Object.assign(rec, data);
      return rec;
    }
  }
}
