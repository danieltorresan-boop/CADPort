'use client';

import { useCallback, useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isConverting: boolean;
}

export default function FileUploader({ onFileSelect, isConverting }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const dwgFile = files.find(file => file.name.toLowerCase().endsWith('.dwg'));

    if (dwgFile) {
      onFileSelect(dwgFile);
    } else {
      alert('Please drop a DWG file');
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all
        ${isDragging
          ? 'border-blue-400 bg-blue-500/10 scale-[1.02]'
          : 'border-white/20 bg-white/5 backdrop-blur-sm hover:border-blue-400/50 hover:bg-white/10'
        }
        ${isConverting ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Upload Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <p className="text-xl font-semibold text-white mb-2">
            Drop your DWG file here
          </p>
          <p className="text-sm text-blue-200/70 mb-4">
            or click to browse
          </p>
        </div>

        {/* Browse Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".dwg"
            onChange={handleFileInput}
            className="hidden"
            disabled={isConverting}
          />
          <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105">
            Browse Files
          </div>
        </label>

        {/* Supported Formats */}
        <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-blue-300/70">
            Supports: <span className="text-blue-300 font-medium">.dwg</span> files (AutoCAD 2000-2018)
          </p>
        </div>
      </div>
    </div>
  );
}
