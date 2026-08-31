import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { storageService } from './storage.service';
import { aiService } from './ai.service';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { CertificateRepository } from '../repositories/certificate.repository';
import { generateS3Key } from '../middleware/upload.middleware';
import { AiPredictionResponse } from '../types';
import { AppError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export class DetectionService {
  private analysisRepo: AnalysisRepository;
  private certRepo: CertificateRepository;

  constructor() {
    this.analysisRepo = new AnalysisRepository();
    this.certRepo = new CertificateRepository();
  }

  async analyzeOnion(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
    originalName: string
  ) {
    const s3Key = generateS3Key('originals', originalName);
    const imageUrl = await storageService.uploadFile(s3Key, fileBuffer, mimeType);
    logger.info(`Original image uploaded: ${imageUrl}`, { userId });

    const aiResult: AiPredictionResponse = await aiService.predict(
      fileBuffer,
      mimeType,
      originalName
    );

    let processedImageUrl = aiResult.processedImage;
    if (processedImageUrl?.startsWith('data:')) {
      const base64Data = processedImageUrl.split(',')[1];
      const processedBuffer = Buffer.from(base64Data, 'base64');
      const processedKey = generateS3Key('processed', originalName);
      processedImageUrl = await storageService.uploadFile(
        processedKey,
        processedBuffer,
        'image/jpeg'
      );
    }

    const analysis = await this.analysisRepo.create({
      userId,
      imageUrl,
      processedImageUrl,
      grade: aiResult.grade,
      score: aiResult.score,
      size: aiResult.size,
      freshness: aiResult.freshness,
      damageLevel: aiResult.damage,
      recommendation: aiResult.recommendation,
      aiModelVersion: aiResult.modelVersion ?? 'YOLO11n-v2.0',
      processingTimeMs: aiResult.processingTimeMs,
      defects: aiResult.defects.map((d) => ({
        defectType: d.type,
        diseaseName: d.diseaseName,
        confidence: d.confidence,
        areaPercentage: d.areaPercentage,
        severity: d.severity,
        treatment: d.treatment,
        storageAdvice: d.storageAdvice,
        xMin: d.bbox?.xMin,
        yMin: d.bbox?.yMin,
        xMax: d.bbox?.xMax,
        yMax: d.bbox?.yMax,
      })),
    });

    const certificate = await this.generateCertificate(analysis.id, userId, analysis as any);

    logger.info(`Analysis complete: grade=${aiResult.grade}, score=${aiResult.score}`, {
      analysisId: analysis.id,
      userId,
    });

    return {
      analysis,
      certificate,
      grade: aiResult.grade,
      score: aiResult.score,
      size: aiResult.size,
      freshness: aiResult.freshness,
      damage: aiResult.damage,
      recommendation: aiResult.recommendation,
      processedImage: processedImageUrl,
      defects: aiResult.defects,
      certificateUrl: certificate.pdfUrl,
    };
  }

  async getHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { analyses, total } = await this.analysisRepo.findByUserId(userId, skip, limit);
    return {
      items: analyses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAnalysisById(id: string, userId?: string) {
    const analysis = await this.analysisRepo.findById(id);
    if (!analysis) throw new NotFoundError('Analysis not found');
    return analysis;
  }

  async deleteAnalysis(id: string, userId: string) {
    const analysis = await this.analysisRepo.findById(id);
    if (!analysis) throw new NotFoundError('Analysis not found');
    if (analysis.userId !== userId) throw new AppError('Forbidden', 403);
    await this.analysisRepo.deleteById(id);
  }

  async generateCertificate(analysisId: string, userId: string, analysis: any) {
    const certNumber = this.certRepo.generateCertificateNumber();
    const qrData = JSON.stringify({
      certNumber,
      analysisId,
      grade: analysis.grade,
      score: analysis.score,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 200 });
    const pdfBuffer = await this.buildCertificatePdf(analysis, certNumber, qrCodeDataUrl);
    const pdfKey = generateS3Key('certificates', `${certNumber}.pdf`);
    const pdfUrl = await storageService.uploadPdf(pdfKey, pdfBuffer);

    return this.certRepo.create({
      analysisId,
      userId,
      qrCode: qrCodeDataUrl,
      pdfUrl,
    });
  }

  private buildCertificatePdf(
    analysis: any,
    certNumber: string,
    qrDataUrl: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('NATIONAL ONION QUALITY CERTIFICATE', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Certificate No: ${certNumber}`, { align: 'center' })
        .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' })
        .moveDown(1.5);

      doc
        .fontSize(48)
        .font('Helvetica-Bold')
        .fillColor(analysis.grade === 'A' ? '#27ae60' : analysis.grade === 'B' ? '#f39c12' : '#e74c3c')
        .text(`Grade: ${analysis.grade}`, { align: 'center' })
        .fillColor('black')
        .moveDown(0.5);

      doc.fontSize(14).font('Helvetica-Bold').text('SIH26031 YOLO11 Analysis Details', { underline: true }).moveDown(0.3);

      const details = [
        ['Quality Index Score', `${analysis.score}/100`],
        ['Bulb Size Category', analysis.size],
        ['Freshness Rating', analysis.freshness],
        ['Damage Severity', analysis.damageLevel],
        ['APMC Recommendation', analysis.recommendation],
        ['AI Vision Engine', analysis.aiModelVersion ?? 'YOLO11n-v2.0'],
      ];

      doc.fontSize(12).font('Helvetica');
      details.forEach(([label, value]) => {
        doc.text(`${label}: `, { continued: true }).font('Helvetica-Bold').text(value).font('Helvetica');
      });

      doc.moveDown(1);
      doc.fontSize(10).fillColor('#7f8c8d').text('This certificate is digitally signed by SIH26031 AI Infrastructure.', { align: 'center' });

      doc.end();
    });
  }

  async getCertificatePdf(analysisId: string) {
    const cert = await this.certRepo.findByAnalysisId(analysisId);
    if (!cert) throw new NotFoundError('Certificate not found');
    return cert;
  }
}
