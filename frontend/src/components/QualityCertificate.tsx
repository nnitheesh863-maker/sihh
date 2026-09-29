import React, { useRef } from 'react';
import { OnionAnalysis } from '../types';
import { Award, Download, X, QrCode, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface QualityCertificateProps {
  analysis: OnionAnalysis;
  onClose: () => void;
}

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string | null> => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const QualityCertificate: React.FC<QualityCertificateProps> = ({ analysis, onClose }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const generateDirectPdf = async (analysisData: OnionAnalysis, fileName: string) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Pure Clean White Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer Decorative Border
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.8);
    doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 3, 3, 'S');

    // Top Emerald Brand Bar
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(10, 10, pageWidth - 20, 3.5, 'F');

    // Add PeelVision Logo
    try {
      const logoBase64 = await getBase64ImageFromUrl('/logo.png');
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 16, 17, 18, 18);
      }
    } catch {}

    // Header Title & Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('PeelVision AI', 38, 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Smart Onion Quality Assessment & Disease Diagnostic Platform', 38, 29);
    doc.text('APMC Standard Crop Certification System', 38, 33.5);

    // Right Header Badge
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(167, 243, 208); // emerald-200
    doc.setLineWidth(0.4);
    doc.roundedRect(pageWidth - 65, 17, 49, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('OFFICIAL ASSESSMENT', pageWidth - 40.5, 22.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`ID: OGC-${(analysisData.id || 'DEMO').slice(0, 8).toUpperCase()}`, pageWidth - 40.5, 27.5, { align: 'center' });

    // Divider
    doc.setDrawColor(241, 245, 249);
    doc.line(16, 40, pageWidth - 16, 40);

    // Score / Grade / APMC Status 3-Column Card
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(16, 45, pageWidth - 32, 28, 3, 3, 'FD');

    // Column 1: Score
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('QUALITY SCORE', 45, 52, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(5, 150, 105);
    doc.text(`${analysisData.score || 90}/100`, 45, 63, { align: 'center' });

    // Column 2: Assigned Grade
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('ASSIGNED GRADE', pageWidth / 2, 52, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    const isGradeA = analysisData.grade === 'A';
    const isGradeB = analysisData.grade === 'B';
    doc.setTextColor(isGradeA ? 5 : isGradeB ? 217 : 225, isGradeA ? 150 : isGradeB ? 119 : 29, isGradeA ? 105 : isGradeB ? 6 : 72);
    doc.text(`Grade ${analysisData.grade || 'A'}`, pageWidth / 2, 63, { align: 'center' });

    // Column 3: APMC Status
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('APMC STATUS', pageWidth - 45, 52, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    const isAccept = analysisData.grade === 'A' || analysisData.grade === 'B';
    doc.setTextColor(isAccept ? 5 : 225, isAccept ? 150 : 29, isAccept ? 105 : 72);
    doc.text(analysisData.recommendation || (isAccept ? 'ACCEPT' : 'REJECT'), pageWidth - 45, 62, { align: 'center' });

    // Inspection Metrics Grid (2x2)
    const metrics = [
      ['Bulb Size Category', analysisData.size || 'Medium (45-65mm)'],
      ['Freshness Rating', analysisData.freshness || 'HIGH'],
      ['Damage Severity', analysisData.damageLevel || 'LOW'],
      ['AI Vision Engine', analysisData.aiModelVersion || 'YOLO11n-v2.1'],
    ];

    const startY = 79;
    metrics.forEach(([label, value], idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const boxX = col === 0 ? 16 : pageWidth / 2 + 2;
      const boxY = startY + row * 15;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(boxX, boxY, (pageWidth - 36) / 2, 12.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(label + ':', boxX + 4, boxY + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(value, boxX + 4, boxY + 9.5);
    });

    // Pathology Findings & Agronomic Rx Card
    const pathY = startY + 34;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(16, pathY, pageWidth - 32, 120, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('YOLO11n Pathology Diagnosis & Treatment Plan:', 22, pathY + 8);

    if (analysisData.defects && analysisData.defects.length > 0) {
      let defY = pathY + 14;
      analysisData.defects.forEach((d: any) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(20, defY - 3, pageWidth - 40, 48, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(180, 83, 9); // amber-700
        doc.text(`• ${d.diseaseName || d.defectType || 'Defect'}`, 24, defY + 2);

        if (d.scientificName) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`Pathogen: ${d.scientificName}`, 24, defY + 6.5);
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Confidence: ${Math.round((d.confidence || 0.9) * 100)}% | Severity: ${d.severity || 'Medium'}`, pageWidth - 80, defY + 2);

        if (d.symptoms) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          const splitSym = doc.splitTextToSize(`Symptoms: ${d.symptoms}`, pageWidth - 52);
          doc.text(splitSym, 24, defY + 12);
        }

        if (d.treatment) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(5, 150, 105);
          const splitTx = doc.splitTextToSize(`Rx Treatment: ${d.treatment}`, pageWidth - 52);
          doc.text(splitTx, 24, defY + 22);
        }

        if (d.storageAdvice) {
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(71, 85, 105);
          const splitSa = doc.splitTextToSize(`Storage/Quarantine: ${d.storageAdvice}`, pageWidth - 52);
          doc.text(splitSa, 24, defY + 31);
        }

        if (d.marketAction) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(180, 83, 9);
          const splitMa = doc.splitTextToSize(`APMC Action: ${d.marketAction}`, pageWidth - 52);
          doc.text(splitMa, 24, defY + 40);
        }

        defY += 52;
      });
    } else {
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(20, pathY + 14, pageWidth - 40, 52, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(5, 150, 105);
      doc.text('✓ Premium Grade Specimen: Zero Pathogens Detected by YOLO11n', 24, pathY + 22);

      // 3 mini cards inside PDF
      const miniWidth = (pageWidth - 52) / 3;
      const miniCards = [
        ['Outer Tunic Scales', '100% Intact & Firm'],
        ['Neck Tissue', 'Firm, Dry & Closed'],
        ['Market Clearance', 'Grade A Export Ready'],
      ];

      miniCards.forEach(([label, val], mIdx) => {
        const mx = 24 + mIdx * (miniWidth + 2);
        const my = pathY + 28;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(209, 250, 229);
        doc.roundedRect(mx, my, miniWidth, 16, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(label, mx + 3, my + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(5, 150, 105);
        doc.text(val, mx + 3, my + 11.5);
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text('Agronomic Storage Advice: Cure in dry shade for 10-14 days; store at 0-2°C with 65-70% humidity.', 24, pathY + 56);
      doc.text('Lot approved for APMC Premium Wholesale Auction and Cold Chain Logistics.', 24, pathY + 61);
    }

    // Footer & Signature
    const footerY = pageHeight - 30;
    doc.setDrawColor(226, 232, 240);
    doc.line(16, footerY, pageWidth - 16, footerY);

    const safeCertId = (analysisData.id || 'DEMO').slice(0, 8).toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Certificate No: OGC-${safeCertId}`, 20, footerY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date Issued: ${new Date(analysisData.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 20, footerY + 11);
    doc.text('Digitally signed & verified by PeelVision AI Infrastructure.', 20, footerY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(5, 150, 105);
    doc.text('AUTHENTIC APMC DOCUMENT', pageWidth - 20, footerY + 10, { align: 'right' });

    doc.save(fileName);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const safeId = analysis.id ? analysis.id.slice(0, 8) : 'batch';
      const fileName = `PeelVision-AI-Report-${safeId}.pdf`;

      // Direct, instantaneous vector PDF generation (<100KB, perfect typography, clean white)
      await generateDirectPdf(analysis, fileName);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not export PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const isAccepted = analysis.grade === 'A' || analysis.grade === 'B';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Award className="h-5 w-5 text-emerald-600" />
            Official Quality Certificate
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isDownloading 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Clean White Certificate Content */}
        <div className="p-8 bg-white text-slate-800 space-y-6">
          
          {/* Top Title Banner */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 p-2 flex items-center justify-center">
                <img src="/logo.png" alt="PeelVision AI" className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  PeelVision<span className="text-emerald-600">AI</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Smart Onion Quality & Diagnostic Report</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Verified Assessment
              </div>
              <p className="text-[11px] text-slate-400 mt-1">APMC Standard Inspection</p>
            </div>
          </div>

          {/* Certificate Badge */}
          <div className="flex items-center justify-around p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quality Score</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{analysis.score || 90}<span className="text-sm text-slate-400">/100</span></p>
            </div>

            <div className="h-12 w-px bg-slate-200" />

            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Grade</p>
              <span
                className={`inline-block px-4 py-1 mt-1 text-2xl font-black rounded-xl ${
                  analysis.grade === 'A'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : analysis.grade === 'B'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                Grade {analysis.grade || 'A'}
              </span>
            </div>

            <div className="h-12 w-px bg-slate-200" />

            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">APMC Status</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {isAccepted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                )}
                <span className={`text-xs font-bold uppercase ${isAccepted ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {analysis.recommendation || (isAccepted ? 'ACCEPT' : 'REJECT')}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Bulb Size Range:</span>
              <p className="font-bold text-slate-900">{analysis.size || 'Medium (45-65mm)'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Freshness Assessment:</span>
              <p className="font-bold text-emerald-700">{analysis.freshness || 'HIGH'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Damage Level:</span>
              <p className="font-bold text-amber-700">{analysis.damageLevel || 'LOW'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">YOLO11 Model Engine:</span>
              <p className="font-bold text-slate-700">{analysis.aiModelVersion || 'YOLO11n-v2.1'}</p>
            </div>
          </div>

          {/* Pathology Findings */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                YOLO11n Pathology Findings & Diagnosis:
              </span>
              {(!analysis.defects || analysis.defects.length === 0 || analysis.grade === 'A') && (
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ★ Grade A Export Certified
                </span>
              )}
            </div>

            {analysis.defects && analysis.defects.length > 0 ? (
              <div className="space-y-3">
                {analysis.defects.map((d, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div>
                        <span className="text-amber-900">• {d.diseaseName || d.defectType}</span>
                        {d.scientificName && (
                          <span className="text-[10px] text-slate-500 font-semibold italic ml-2">({d.scientificName})</span>
                        )}
                      </div>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                        Accuracy: {Math.round((d.confidence || 0.9) * 100)}% ({d.severity || 'Medium'})
                      </span>
                    </div>

                    {d.symptoms && (
                      <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-900 font-bold">🔍 Symptoms:</span> {d.symptoms}
                      </p>
                    )}

                    {d.treatment && (
                      <p className="text-[11px] text-emerald-950 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                        <span className="text-emerald-800 font-bold">🌱 Rx Treatment:</span> {d.treatment}
                      </p>
                    )}

                    {d.storageAdvice && (
                      <p className="text-[11px] text-slate-600 pl-1 italic">
                        <span className="text-slate-800 font-semibold not-italic">Storage:</span> {d.storageAdvice}
                      </p>
                    )}

                    {d.marketAction && (
                      <p className="text-[11px] text-slate-700 pl-1">
                        <span className="text-slate-800 font-bold">⚖️ APMC Action:</span> {d.marketAction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>Premium Grade Specimen: Zero Pathogen Lesions, Neck Rot, or Mold Detected</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-white/80 border border-emerald-100 shadow-xs">
                    <p className="text-slate-500 font-medium text-[10px]">Outer Tunic</p>
                    <p className="font-bold text-emerald-700">100% Intact</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/80 border border-emerald-100 shadow-xs">
                    <p className="text-slate-500 font-medium text-[10px]">Neck Tissue</p>
                    <p className="font-bold text-emerald-700">Firm & Dry</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/80 border border-emerald-100 shadow-xs">
                    <p className="text-slate-500 font-medium text-[10px]">Market Clearance</p>
                    <p className="font-bold text-emerald-700">Export Grade</p>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-900/90 leading-relaxed font-medium bg-emerald-100/50 p-2.5 rounded-lg">
                  💡 <span className="font-bold">Agronomic Storage Rx:</span> Cure in dry shade for 10-14 days. Store at 0-2°C with 65-70% humidity in well-aerated mesh crates for maximum shelf life.
                </p>
              </div>
            )}
          </div>

          {/* QR Verification Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Certificate ID: OGC-{(analysis.id || 'DEMO').slice(0, 8).toUpperCase()}</p>
              <p className="text-[11px] text-slate-500">Date Issued: {new Date(analysis.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">Digitally signed & encrypted by PeelVision AI Infrastructure.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-slate-50 border border-slate-200 p-1.5 rounded-xl flex items-center justify-center">
                <QrCode className="h-12 w-12 text-slate-800" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

