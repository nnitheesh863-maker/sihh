import React, { useRef } from 'react';
import { OnionAnalysis } from '../types';
import { Award, Download, X, QrCode, CheckCircle2, ShieldAlert } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface QualityCertificateProps {
  analysis: OnionAnalysis;
  onClose: () => void;
}

export const QualityCertificate: React.FC<QualityCertificateProps> = ({ analysis, onClose }) => {
  const certRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Onion-Certificate-${analysis.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
    }
  };

  const isAccepted = analysis.grade === 'A' || analysis.grade === 'B';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Award className="h-5 w-5 text-emerald-400" />
            Digital Quality Certificate
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Document Content for Canvas Render */}
        <div ref={certRef} className="p-8 bg-slate-900 text-slate-100 space-y-6">
          
          {/* Top Title Banner */}
          <div className="text-center space-y-2 border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              SIH26031 Verified Assessment
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">NATIONAL ONION QUALITY CERTIFICATE</h2>
            <p className="text-xs text-slate-400">
              Government AI Quality & Disease Assessment System • APMC Standard Inspection
            </p>
          </div>

          {/* Certificate Badge */}
          <div className="flex items-center justify-around p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quality Score</p>
              <p className="text-4xl font-black text-emerald-400 mt-1">{analysis.score}<span className="text-sm text-slate-500">/100</span></p>
            </div>

            <div className="h-12 w-px bg-slate-800" />

            <div className="text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Assigned Grade</p>
              <span
                className={`inline-block px-4 py-1 mt-1 text-2xl font-black rounded-xl ${
                  analysis.grade === 'A'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : analysis.grade === 'B'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                Grade {analysis.grade}
              </span>
            </div>

            <div className="h-12 w-px bg-slate-800" />

            <div className="text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">APMC Status</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {isAccepted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                )}
                <span className={`text-xs font-bold uppercase ${isAccepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {analysis.recommendation}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Bulb Size Range:</span>
              <p className="font-semibold text-white">{analysis.size}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Freshness Assessment:</span>
              <p className="font-semibold text-emerald-400">{analysis.freshness}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Damage Level:</span>
              <p className="font-semibold text-amber-400">{analysis.damageLevel}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">YOLO11 Model Engine:</span>
              <p className="font-semibold text-slate-200">{analysis.aiModelVersion}</p>
            </div>
          </div>

          {/* Disease Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">YOLO11n Pathology Findings:</span>
            {analysis.defects && analysis.defects.length > 0 ? (
              <ul className="space-y-1">
                {analysis.defects.map((d, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center justify-between">
                    <span>• {d.diseaseName || d.defectType}</span>
                    <span className="text-slate-400">Conf: {Math.round(d.confidence * 100)}% ({d.severity || 'Medium'})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-400">No diseases or pathogen lesions identified.</p>
            )}
          </div>

          {/* QR Verification Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-white">Certificate ID: OGC-{analysis.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-[11px] text-slate-400">Date Issued: {new Date(analysis.createdAt).toLocaleDateString('en-IN')}</p>
              <p className="text-[10px] text-slate-500">Digitally signed & encrypted by SIH26031 AI Infrastructure.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-white p-1 rounded-xl flex items-center justify-center">
                <QrCode className="h-14 w-14 text-slate-950" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
