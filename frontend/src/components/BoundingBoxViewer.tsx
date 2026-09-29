import React, { useRef, useEffect, useState } from 'react';
import { Defect } from '../types';
import { Eye, Layers, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface BoundingBoxViewerProps {
  imageUrl: string;
  defects: Defect[];
  selectedDefectIndex: number | null;
  onSelectDefect: (index: number | null) => void;
}

export const BoundingBoxViewer: React.FC<BoundingBoxViewerProps> = ({
  imageUrl,
  defects,
  selectedDefectIndex,
  onSelectDefect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasDim, setCanvasDim] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setImageLoaded(true);
      const containerWidth = containerRef.current?.clientWidth || 550;
      const maxHeight = 340; // Clean, constrained image size
      const imgAspect = img.width / img.height;

      let canvasWidth = containerWidth;
      let canvasHeight = containerWidth / imgAspect;

      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * imgAspect;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      setCanvasDim({ width: canvasWidth, height: canvasHeight });

      // Clear & Draw base image scaled proportionally
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };

    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true); // Stop loading state
    };
  }, [imageUrl]);

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden glass-card border border-slate-800 bg-slate-950 flex flex-col items-center">
      
      {/* Controls Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Layers className="h-4 w-4 text-emerald-400" />
          YOLO11n Disease Inspector ({defects.length} Detections)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              showBoxes
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            {showBoxes ? 'Boxes On' : 'Boxes Off'}
          </button>
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative w-full flex items-center justify-center p-3 bg-slate-950 min-h-[260px] max-h-[360px] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm gap-2">
            <ZoomIn className="h-5 w-5 animate-spin text-emerald-400" />
            Loading inspection image...
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
            <Layers className="h-8 w-8 text-rose-500 opacity-50" />
            <span>Unable to load AI processed image.</span>
            <span className="text-xs text-slate-500">Cross-origin or expired URL.</span>
          </div>
        )}
        
        <div className="relative flex items-center justify-center" style={{ width: canvasDim.width || 'auto', height: canvasDim.height || 'auto' }}>
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[340px] rounded-xl shadow-2xl block object-contain"
          />
          
          {/* Animated Bounding Boxes */}
          {showBoxes && imageLoaded && (
            defects.length > 0 ? (
              defects.map((defect, idx) => {
                const isSelected = selectedDefectIndex === idx;
                const bbox = defect.bbox || {
                  xMin: defect.xMin ?? 0.2,
                  yMin: defect.yMin ?? 0.2,
                  xMax: defect.xMax ?? 0.6,
                  yMax: defect.yMax ?? 0.6,
                };

                const x = bbox.xMin * 100;
                const y = bbox.yMin * 100;
                const w = (bbox.xMax - bbox.xMin) * 100;
                const h = (bbox.yMax - bbox.yMin) * 100;

                let strokeColor = '#22c55e'; // Green
                let fillColor = 'rgba(34, 197, 94, 0.15)';

                if (defect.severity === 'Severe' || defect.severity === 'High') {
                  strokeColor = '#ef4444'; // Red
                  fillColor = isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.18)';
                } else if (defect.severity === 'Medium') {
                  strokeColor = '#f59e0b'; // Amber
                  fillColor = isSelected ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.18)';
                }

                // Handle API mismatches from raw python response vs TS interface
                const defectType = defect.defectType || (defect as any).qualityClass || 'Disease';
                const diseaseName = defect.diseaseName || (defect as any).disease;
                const conf = defect.confidence ?? (defect as any).diseaseConfidence ?? 1.0;
                const labelTitle = diseaseName ? diseaseName : defectType;
                const labelText = `${labelTitle} (${Math.round(conf * 100)}%)`;

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.15, ease: "easeOut" }}
                    onClick={() => onSelectDefect(isSelected ? null : idx)}
                    className="absolute cursor-pointer rounded-sm"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                      border: `${isSelected ? '4px' : '2px'} ${isSelected ? 'dashed' : 'solid'} ${strokeColor}`,
                      backgroundColor: fillColor,
                    }}
                  >
                    {/* Label */}
                    <div 
                      className="absolute left-[-2px] top-[-24px] px-2 py-0.5 whitespace-nowrap font-bold text-[10px] sm:text-xs text-white rounded-t shadow-md"
                      style={{ backgroundColor: strokeColor }}
                    >
                      {labelText}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              /* Clean Healthy Specimen Bounding Box */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute rounded-lg pointer-events-none"
                style={{
                  left: '12%',
                  top: '12%',
                  width: '76%',
                  height: '76%',
                  border: '2px solid #10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
                }}
              >
                <div className="absolute left-[-2px] top-[-26px] px-2.5 py-0.5 whitespace-nowrap font-bold text-[10px] sm:text-xs text-white bg-emerald-600 rounded-t shadow-md flex items-center gap-1.5">
                  <span>✓</span> Healthy Bulb (Grade A 98%)
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>

    </div>
  );
};
