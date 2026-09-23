import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, X } from 'lucide-react';

interface ExportModalProps {
  batchId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportModalProps> = ({ batchId, isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (format: 'pdf' | 'csv') => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-white relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-2">Export Batch Assessment Report</h3>
        <p className="text-sm text-slate-400 mb-6">
          Download certified AGMARK grading compliance certificates for batch: <span className="text-emerald-400 font-mono font-semibold">{batchId}</span>
        </p>

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <span>Report downloaded successfully!</span>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-rose-400" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Official AGMARK Certificate (PDF)</p>
                  <p className="text-xs text-slate-400">Formatted with QR Verification</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleDownload('csv')}
              disabled={downloading}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Raw Inspection Telemetry (CSV)</p>
                  <p className="text-xs text-slate-400">Per-onion diameter, weight & defect list</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
