import React, { useState } from 'react';
import { onionApi } from '../api/onion.api';
import { OnionAnalysis } from '../types';
import { BoundingBoxViewer } from '../components/BoundingBoxViewer';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Upload, Sparkles, AlertTriangle, ArrowRight, Activity, Leaf, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_IMAGES = [
  { name: 'Purple Blotch', url: '/sample-1.jpg', status: 'completed' },
  { name: 'High Grade', url: '/sample-2.jpg', status: 'to do' },
  { name: 'Neck Rot', url: '/sample-3.jpg', status: 'in progress' },
  { name: 'Fresh Batch', url: '/sample-4.jpg', status: 'completed' },
];

export const ScannerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('Initializing Scanner...');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
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
    <div className="space-y-6">
      {isScanning && <LoadingOverlay stage={scanStage} />}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 pl-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Onion Crop Monitoring</h1>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
            <span>{new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })} scan day</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>Batch Analysis Mode</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 text-xs font-bold uppercase tracking-widest shadow-sm">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Monitor & Samples) - 8 cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Monitor View */}
          <div className="relative rounded-[2rem] overflow-hidden bg-emerald-900 border border-emerald-800 shadow-xl min-h-[460px] flex items-center justify-center p-2 group">
            
            {/* Background Map / Abstract Pattern (shown if no preview) */}
            {!previewUrl && (
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-emerald-900 to-black pointer-events-none" />
            )}

            {!previewUrl ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`relative z-10 p-10 rounded-3xl text-center transition-all cursor-pointer ${
                  dragActive ? 'scale-105 bg-emerald-800/40' : 'hover:bg-emerald-800/20'
                }`}
              >
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} className="hidden" id="onion-upload-input" />
                <label htmlFor="onion-upload-input" className="cursor-pointer space-y-4 block">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Upload Batch Image</h3>
                    <p className="text-xs text-emerald-200 mt-2 font-medium">Drag and drop or click to scan</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center rounded-[1.5rem] overflow-hidden bg-black/40">
                {analysisResult ? (
                  <BoundingBoxViewer
                    imageUrl={analysisResult.processedImage || previewUrl}
                    defects={analysisResult.defects || []}
                    selectedDefectIndex={null}
                    onSelectDefect={() => {}}
                  />
                ) : (
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl" />
                )}

                {/* Overlays simulating the TerraScan UI */}
                {!analysisResult && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Targeting Crosshairs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[1px] border-emerald-400/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-400/30 rounded-full" />
                    
                    {/* Fake scanning brackets */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-emerald-400 font-medium">
                      <div className="w-4 h-6 border-l-2 border-b-2 border-emerald-400"></div>
                      <span className="uppercase tracking-widest text-xs font-bold">Scanning...</span>
                      <div className="w-4 h-6 border-r-2 border-b-2 border-emerald-400"></div>
                    </div>
                  </div>
                )}
                
                {/* Floating Glass Pills */}
                {analysisResult?.batchReport && (
                  <>
                    <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Score: {analysisResult.score}/100
                    </div>
                    <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> Grade: {analysisResult.grade}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bottom Controls / Action Bar */}
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample.url)}
                  className="relative flex-shrink-0 w-36 h-24 rounded-2xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm group"
                >
                  <img src={sample.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {sample.status}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                    <p className="text-[10px] text-white font-semibold truncate">{sample.name}</p>
                  </div>
                </button>
              ))}
            </div>

            {previewUrl && !analysisResult && (
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="flex-shrink-0 px-8 py-4 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                Analyze Crop
              </button>
            )}
            
            {analysisResult && (
              <button
                onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAnalysisResult(null); }}
                className="flex-shrink-0 px-8 py-4 rounded-[1.5rem] bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                Scan New Batch
              </button>
            )}
          </div>

        </div>

        {/* Right Column (Analytics & Recommendations) - 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quality Breakdown Chart */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Batch Quality Rate</h3>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer">
                <div className="space-y-1">
                  <div className="w-3.5 h-0.5 bg-slate-400 rounded"></div>
                  <div className="w-2.5 h-0.5 bg-slate-400 rounded"></div>
                  <div className="w-3 h-0.5 bg-slate-400 rounded"></div>
                </div>
              </div>
            </div>

            {analysisResult?.batchReport ? (
              <div className="flex items-end h-32 gap-3 mt-4">
                {/* Fake Bar Chart based on real stats */}
                <div className="flex-1 flex flex-col justify-end items-center gap-2 group">
                  <div className="w-full bg-emerald-400 rounded-t-lg rounded-b-sm transition-all group-hover:bg-emerald-500" style={{ height: `${Math.max(10, (analysisResult.batchReport.healthyCount / analysisResult.batchReport.totalOnions) * 100)}%` }}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Healthy</span>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center gap-2 group">
                  <div className="w-full bg-slate-200 rounded-t-lg rounded-b-sm transition-all group-hover:bg-slate-300" style={{ height: `${Math.max(10, (analysisResult.batchReport.damagedCount / analysisResult.batchReport.totalOnions) * 100)}%` }}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Damage</span>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center gap-2 group">
                  <div className="w-full bg-[#1b4332] rounded-t-lg rounded-b-sm transition-all" style={{ height: `${Math.max(10, (analysisResult.batchReport.rottenCount / analysisResult.batchReport.totalOnions) * 100)}%` }}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Rot</span>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center gap-2 group">
                  <div className="w-full bg-emerald-200 rounded-t-lg rounded-b-sm transition-all" style={{ height: `${Math.max(10, (analysisResult.batchReport.undersizedCount / analysisResult.batchReport.totalOnions) * 100)}%` }}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Size</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">Awaiting scan...</span>
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800">AI Recommendations</h3>
            
            <div className="flex flex-col gap-2 mt-2">
              {analysisResult?.batchReport?.recommendations ? (
                analysisResult.batchReport.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className={`w-full p-4 rounded-[1.25rem] flex items-center justify-between text-xs font-bold cursor-pointer transition-transform hover:scale-[1.02] ${
                    idx === 0 ? 'bg-[#1b4332] text-white shadow-lg shadow-[#1b4332]/20 z-30' : 
                    idx === 1 ? 'bg-emerald-100 text-emerald-900 -mt-3 shadow-md z-20' : 
                    'bg-slate-100 text-slate-700 -mt-3 shadow-sm z-10'
                  }`}>
                    <span className="flex-1 truncate pr-2">{rec}</span>
                    <ArrowRight className="w-4 h-4 opacity-50 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <>
                  <div className="w-full p-4 rounded-[1.25rem] bg-slate-100/50 text-slate-400 flex items-center justify-between text-xs font-bold border border-slate-100 border-dashed">
                    Upload an image to get recommendations
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Efficiency / Grading Score */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800">Quality Index</h3>
            
            {analysisResult?.batchReport ? (
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-4xl font-black text-slate-800">{analysisResult.batchReport.gradeAPercentage}%</p>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide mt-1">Grade A Yield</p>
                </div>
                
                <div className="relative w-20 h-20">
                  {/* Circular progress simulating the chart */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${analysisResult.batchReport.gradeAPercentage * 2.26} 226`} className="text-[#1b4332] transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Avg</span>
                    <span className="text-sm font-black text-slate-800">{analysisResult.batchReport.qualityScore}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">No data</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
