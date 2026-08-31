import React, { useRef, useEffect, useState } from 'react';
import { Defect } from '../types';
import { Eye, Layers, ZoomIn } from 'lucide-react';

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
  const [showBoxes, setShowBoxes] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      setImageLoaded(true);
      const containerWidth = containerRef.current?.clientWidth || 600;
      const scale = containerWidth / img.width;
      const canvasWidth = containerWidth;
      const canvasHeight = img.height * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear & Draw base image
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      if (!showBoxes) return;

      // Draw bounding boxes
      defects.forEach((defect, idx) => {
        const isSelected = selectedDefectIndex === idx;
        const bbox = defect.bbox || {
          xMin: defect.xMin ?? 0.2,
          yMin: defect.yMin ?? 0.2,
          xMax: defect.xMax ?? 0.6,
          yMax: defect.yMax ?? 0.6,
        };

        const x = bbox.xMin * canvasWidth;
        const y = bbox.yMin * canvasHeight;
        const w = (bbox.xMax - bbox.xMin) * canvasWidth;
        const h = (bbox.yMax - bbox.yMin) * canvasHeight;

        // Color based on severity
        let strokeColor = '#22c55e'; // Green
        let fillColor = 'rgba(34, 197, 94, 0.15)';

        if (defect.severity === 'Severe' || defect.severity === 'High') {
          strokeColor = '#ef4444'; // Red
          fillColor = isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.18)';
        } else if (defect.severity === 'Medium') {
          strokeColor = '#f59e0b'; // Amber
          fillColor = isSelected ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.18)';
        }

        // Draw fill & border
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isSelected ? 4 : 2.5;
        ctx.setLineDash(isSelected ? [6, 4] : []);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        // Label Tag
        const labelText = `${defect.defectType || defect.diseaseName || 'Disease'} (${Math.round(
          defect.confidence * 100
        )}%)`;

        ctx.font = 'bold 12px Inter, sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        const pad = 6;

        ctx.fillStyle = strokeColor;
        ctx.fillRect(x, Math.max(0, y - 24), textWidth + pad * 2, 22);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, x + pad, Math.max(14, y - 8));
      });
    };
  }, [imageUrl, defects, selectedDefectIndex, showBoxes]);

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden glass-card border border-slate-800">
      
      {/* Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
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
            {showBoxes ? 'Bounding Boxes On' : 'Bounding Boxes Off'}
          </button>
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative flex items-center justify-center p-2 bg-slate-950/60 min-h-[300px]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm gap-2">
            <ZoomIn className="h-5 w-5 animate-spin text-emerald-400" />
            Loading inspection image...
          </div>
        )}
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            if (!canvasRef.current || !defects.length) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const clickX = (e.clientX - rect.left) / rect.width;
            const clickY = (e.clientY - rect.top) / rect.height;

            const foundIdx = defects.findIndex((d) => {
              const bbox = d.bbox || {
                xMin: d.xMin ?? 0.2,
                yMin: d.yMin ?? 0.2,
                xMax: d.xMax ?? 0.6,
                yMax: d.yMax ?? 0.6,
              };
              return clickX >= bbox.xMin && clickX <= bbox.xMax && clickY >= bbox.yMin && clickY <= bbox.yMax;
            });

            onSelectDefect(foundIdx !== -1 ? foundIdx : null);
          }}
          className="max-w-full rounded-xl cursor-pointer shadow-2xl"
        />
      </div>

    </div>
  );
};
