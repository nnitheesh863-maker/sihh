import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { s3Service } from '../aws/s3.service';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { CertificateRepository } from '../repositories/certificate.repository';
import { aiService } from '../ai/ai.client';
import { generateS3Key } from '../middlewares/upload.middleware';
import { AiPredictionResponse } from '../types';
import { AppError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

// ─── AI Analysis Service ──────────────────────────────────────────────────────

export class AnalysisService {
  private analysisRepo: AnalysisRepository;
  private certRepo: CertificateRepository;

  constructor() {
    this.analysisRepo = new AnalysisRepository();
    this.certRepo = new CertificateRepository();
  }

  /**
   * Full analysis pipeline:
   * 1. Upload original image to S3
   * 2. Call Python AI service
   * 3. Upload processed image to S3
   * 4. Save to database
   * 5. Generate certificate
   */
  async analyzeOnion(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
    originalName: string
  ) {
    // 1 – Upload original image to S3
    const s3Key = generateS3Key('originals', originalName);
    const imageUrl = await s3Service.uploadFile(s3Key, fileBuffer, mimeType);
    logger.info(`Original image uploaded: ${imageUrl}`, { userId });

    // 2 – Call AI service
    const aiResult: AiPredictionResponse = await aiService.predict(
      fileBuffer,
      mimeType,
      originalName
    );

    if (!aiResult.qualityGatePassed || !aiResult.batchReport) {
      throw new AppError(aiResult.qualityGateMessage || 'Image failed quality gate.', 400);
    }

    // 3 – Upload processed image (returned from AI) if it is base64
    let processedImageUrl = aiResult.processedImage;
    if (processedImageUrl?.startsWith('data:')) {
      const base64Data = processedImageUrl.split(',')[1];
      const processedBuffer = Buffer.from(base64Data, 'base64');
      const processedKey = generateS3Key('processed', originalName);
      processedImageUrl = await s3Service.uploadFile(
        processedKey,
        processedBuffer,
        'image/jpeg'
      );
    }

    // 4 – Persist analysis + defects to DB (mapping new AI response to old schema)
    const grade = aiResult.batchReport.gradeAPercentage > 80 ? 'A' : aiResult.batchReport.gradeAPercentage > 50 ? 'B' : aiResult.batchReport.ursPercentage > 80 ? 'REJECTED' : 'C';
    const score = aiResult.batchReport.qualityScore;
    const recommendation = aiResult.batchReport.overallRiskLevel === 'High' ? 'REJECT' : aiResult.batchReport.overallRiskLevel === 'Medium' ? 'CONDITIONAL_ACCEPT' : 'ACCEPT';

    const analysis = await this.analysisRepo.create({
      userId,
      imageUrl,
      processedImageUrl,
      grade: grade,
      score: score,
      size: 'Mixed (Batch)',
      freshness: aiResult.batchReport.rottenCount > 0 ? 'LOW' : 'HIGH',
      damageLevel: aiResult.batchReport.damagedCount > 0 ? 'MEDIUM' : 'LOW',
      recommendation: recommendation,
      aiModelVersion: 'Multi-Stage-Pipeline-v3',
      processingTimeMs: aiResult.processingTimeMs,
      defects: aiResult.onions.filter(o => o.disease).map((o) => ({
        defectType: o.qualityClass,
        diseaseName: o.disease,
        confidence: o.diseaseConfidence,
        severity: o.severity,
        xMin: o.bbox.xMin,
        yMin: o.bbox.yMin,
        xMax: o.bbox.xMax,
        yMax: o.bbox.yMax,
      })),
    });

    // 5 – Generate certificate
    const certificate = await this.generateCertificate(analysis.id, userId, analysis as any);

    logger.info(`Analysis complete: grade=${grade}, score=${score}`, {
      analysisId: analysis.id,
      userId,
    });

    return {
      analysis,
      certificate,
      grade: grade,
      score: score,
      size: 'Mixed (Batch)',
      freshness: aiResult.batchReport.rottenCount > 0 ? 'LOW' : 'HIGH',
      damage: aiResult.batchReport.damagedCount > 0 ? 'MEDIUM' : 'LOW',
      recommendation: recommendation,
      processedImage: processedImageUrl,
      defects: aiResult.onions, // Return the raw onions back to the frontend
      batchReport: aiResult.batchReport,
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
    // If userId provided, check ownership (unless admin)
    return analysis;
  }

  async deleteAnalysis(id: string, userId: string) {
    const analysis = await this.analysisRepo.findById(id);
    if (!analysis) throw new NotFoundError('Analysis not found');
    if (analysis.userId !== userId) throw new AppError('Forbidden', 403);
    await this.analysisRepo.deleteById(id);
  }

  // ── Certificate Generation ─────────────────────────────────────────────────

  async generateCertificate(analysisId: string, userId: string, analysis: any) {
    // Generate QR Code (points to certificate page)
    const certNumber = this.certRepo.generateCertificateNumber();
    const qrData = JSON.stringify({
      certNumber,
      analysisId,
      grade: analysis.grade,
      score: analysis.score,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 200 });

    // Generate PDF certificate
    const pdfBuffer = await this.buildCertificatePdf(analysis, certNumber, qrCodeDataUrl);

    // Upload PDF to S3
    const pdfKey = generateS3Key('certificates', `${certNumber}.pdf`);
    const pdfUrl = await s3Service.uploadPdf(pdfKey, pdfBuffer);

    // Save certificate
    const certificate = await this.certRepo.create({
      analysisId,
      userId,
      qrCode: qrCodeDataUrl,
      pdfUrl,
    });

    // Update with generated number (already set inside repo, but store URL)
    return certificate;
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

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('ONION QUALITY CERTIFICATE', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Certificate No: ${certNumber}`, { align: 'center' })
        .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' })
        .moveDown(1.5);

      // Grade Badge
      doc
        .fontSize(48)
        .font('Helvetica-Bold')
        .fillColor(analysis.grade === 'A' ? '#27ae60' : analysis.grade === 'B' ? '#f39c12' : '#e74c3c')
        .text(`Grade: ${analysis.grade}`, { align: 'center' })
        .fillColor('black')
        .moveDown(0.5);

      // Details
      doc.fontSize(14).font('Helvetica-Bold').text('Analysis Details', { underline: true }).moveDown(0.3);

      const details = [
        ['Quality Score', `${analysis.score}/100`],
        ['Size', analysis.size],
        ['Freshness', analysis.freshness],
        ['Damage Level', analysis.damageLevel],
        ['Recommendation', analysis.recommendation],
        ['AI Model Version', analysis.aiModelVersion ?? '1.0.0'],
      ];

      doc.fontSize(12).font('Helvetica');
      details.forEach(([label, value]) => {
        doc.text(`${label}: `, { continued: true }).font('Helvetica-Bold').text(value).font('Helvetica');
      });

      doc.moveDown(1);
      doc.fontSize(10).fillColor('#7f8c8d').text('This certificate is digitally generated and verified by the AI Onion Grading System – SIH26031.', { align: 'center' });

      doc.end();
    });
  }

  async getCertificatePdf(analysisId: string) {
    const cert = await this.certRepo.findByAnalysisId(analysisId);
    if (!cert) throw new NotFoundError('Certificate not found');
    return cert;
  }
}
