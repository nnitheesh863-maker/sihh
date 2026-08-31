import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Camera, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, maxSizeMB = 10 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or WEBP.');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const processFile = (file: File) => {
    if (validateFile(file)) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelected(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Onion Disease Detection</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Upload or capture an image of the onion for AI grading.</p>

        {!preview ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl transition-all duration-300 ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-400 dark:hover:border-emerald-500'
            }`}
          >
            <div className="absolute inset-0 w-full h-full bg-emerald-500/0 group-hover:bg-emerald-500/5 dark:group-hover:bg-emerald-500/10 rounded-2xl transition-all duration-300 pointer-events-none" />
            
            <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
              <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <UploadCloud className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">JPG, PNG, or WEBP (Max {maxSizeMB}MB)</p>
            </div>
            
            <input 
              ref={inputRef}
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange} 
            />

            {/* Camera Capture Button (visible mainly on mobile) */}
            <div className="absolute bottom-4 right-4 z-30">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <Camera className="w-4 h-4" />
                <span>Capture</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner group bg-black/5">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain bg-slate-100 dark:bg-slate-950 transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Overlay Gradient for Action Buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={clearImage}
                className="p-2 bg-white/90 hover:bg-red-500 hover:text-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
               <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-800 hover:bg-slate-50 rounded-full text-sm font-semibold shadow-xl transition-all"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Replace
                </button>
            </div>

             {/* Hidden input for replace */}
             <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange} 
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success / Action State */}
        {preview && !error && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Ready for analysis</span>
             </div>
             
             <button
               className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-4 focus:ring-emerald-500/20"
               onClick={() => {
                  // Trigger analysis in parent component
               }}
             >
               Analyze Image
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
