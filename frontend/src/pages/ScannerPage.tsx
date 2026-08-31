import React, { useState } from 'react';
import { onionApi } from '../api/onion.api';
import { OnionAnalysis } from '../types';
import { BoundingBoxViewer } from '../components/BoundingBoxViewer';
import { TreatmentCard } from '../components/TreatmentCard';
import { QualityCertificate } from '../components/QualityCertificate';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Upload, Sparkles, Award, ShieldCheck, Activity, RefreshCw, CheckCircle2, AlertTriangle, Info, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

// Preloaded sample test images
const SAMPLE_IMAGES = [
  {
    name: 'Sample 1: Purple Blotch Lesion',
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sample 2: High Grade Onion',
    url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sample 3: Neck Rot Defect',
    url: 'https://images.unsplash.com/photo-1580196969807-cc4de06654be?auto=format&fit=crop&w=600&q=80',
  },
];

export const ScannerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('Initializing YOLO11n Neural Net...');
  const [analysisResult, setAnalysisResult] = useState<OnionAnalysis | null>(null);
  const [selectedDefectIdx, setSelectedDefectIdx] = useState<number | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleScan = async () => {
    if (!selectedFile && !previewUrl) return;

    setIsScanning(true);
    setScanStage('Analyzing image quality...');

    try {
      setTimeout(() => setScanStage('Scanning for diseases...'), 600);
      setTimeout(() => setScanStage('Generating treatment advice...'), 1200);

      let fileToUpload = selectedFile;
      if (!fileToUpload && previewUrl) {
        // Fetch sample image as file
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], 'sample_onion.jpg', { type: 'image/jpeg' });
      }

      const result = await onionApi.analyzeImage(fileToUpload!);
      setAnalysisResult(result);

      if (result.grade === 'A' || result.grade === 'B') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error('Scan failed', err);
      alert('Analysis failed: ' + (err.response?.data?.message || err.message || 'Error communicating with server'));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSampleClick = async (url: string) => {
    setPreviewUrl(url);
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {isScanning && <LoadingOverlay stage={scanStage} />}
      {showCertificate && analysisResult && (
        <QualityCertificate analysis={analysisResult} onClose={() => setShowCertificate(false)} />
      )}

      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-950 border border-emerald-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Smart Onion Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Check Your Crop Health Instantly
          </h1>
          <p className="text-sm text-emerald-100/70 leading-relaxed">
            Take a photo of your onion to check for diseases. Get an instant quality grade and expert advice on how to treat your crop.
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload & Image Inspection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* File Upload Dropzone */}
          {!previewUrl ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer glass-card ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                  : 'border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/60'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
                id="onion-upload-input"
              />
              <label htmlFor="onion-upload-input" className="cursor-pointer space-y-4 block">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Onion Bulb Image</h3>
                  <p className="text-xs text-slate-400 mt-1">Drag and drop JPEG, PNG or WebP image here, or click to browse</p>
                </div>
                <span className="inline-block px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all">
                  Select File
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Interactive Bounding Box Viewer or Base Preview */}
              {analysisResult ? (
                <BoundingBoxViewer
                  imageUrl={analysisResult.processedImageUrl || previewUrl}
                  defects={analysisResult.defects || []}
                  selectedDefectIndex={selectedDefectIdx}
                  onSelectDefect={setSelectedDefectIdx}
                />
              ) : (
                <div className="relative rounded-2xl overflow-hidden glass-card border border-slate-800 p-2 flex items-center justify-center min-h-[320px]">
                  <img src={previewUrl} alt="Onion Preview" className="max-w-full max-h-[400px] rounded-xl object-contain" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  {analysisResult ? 'Scan Another Image' : 'Scan Onion Now'}
                </button>

                <button
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAnalysisResult(null); }}
                  className="px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Sample Images */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <ImageIcon className="h-4 w-4 text-emerald-400" />
              Try with a sample image
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample.url)}
                  className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all text-left"
                >
                  <img src={sample.url} alt={sample.name} className="h-20 w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2 flex items-end">
                    <span className="text-[10px] font-semibold text-slate-200 truncate">{sample.name.split(':')[1] || sample.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Scorecard & Pathology Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {analysisResult ? (
            <>
              {/* Quality Score Card */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Grade</span>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Digital Certificate
                  </button>
                </div>

                {/* Grade & Score Badge */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl ${
                        analysisResult.grade === 'A'
                          ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                          : analysisResult.grade === 'B'
                          ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                          : 'bg-rose-500 text-white shadow-rose-500/20'
                      }`}
                    >
                      {analysisResult.grade}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Grade {analysisResult.grade} Quality</h3>
                      <p className="text-xs text-slate-400">Recommendation: <strong className="text-emerald-400">{analysisResult.recommendation}</strong></p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-black text-white">{analysisResult.score}</span>
                    <span className="text-xs text-slate-500">/100</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Overall Index</p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Bulb Size</span>
                    <p className="font-bold text-white">{analysisResult.size}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Freshness</span>
                    <p className="font-bold text-emerald-400">{analysisResult.freshness}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Damage Level</span>
                    <p className="font-bold text-amber-400">{analysisResult.damageLevel}</p>
                  </div>
                </div>

              </div>

              {/* Treatment Recommendation Card */}
              <TreatmentCard
                defects={analysisResult.defects || []}
                selectedIndex={selectedDefectIdx}
                onSelectIndex={setSelectedDefectIdx}
              />
            </>
          ) : (
            <div className="p-8 rounded-3xl glass-card border border-slate-800 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
                <Info className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white">Ready for Scan</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Upload a photo or choose a sample image to see disease detection and get treatment recommendations instantly.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
