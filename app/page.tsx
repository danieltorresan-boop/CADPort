'use client';

import { useState, useCallback, useEffect } from 'react';
import FileUploader from '@/components/FileUploader';
import ConversionStatus from '@/components/ConversionStatus';

type ConversionMode = 'dwg-to-dxf' | 'dxf-to-dwg';

export default function Home() {
  const [conversionMode, setConversionMode] = useState<ConversionMode>('dwg-to-dxf');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'converting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the converter when component mounts
  useEffect(() => {
    // Wait for libdxfrw.js to load, then initialize
    const waitForScript = async () => {
      let attempts = 0;
      const maxAttempts = 20; // Wait up to 10 seconds (20 * 500ms)

      while (attempts < maxAttempts) {
        // Check if createModule is available
        if (typeof window !== 'undefined' && (window as any).createModule) {
          console.log('✅ libdxfrw.js loaded, initializing converter...');

          // Dynamically import converter to avoid SSR issues
          const { initializeConverter } = await import('@/lib/converter');
          const success = await initializeConverter();

          setIsInitialized(success);
          if (!success) {
            console.error('Failed to initialize DWG converter');
          }
          return;
        }

        // Wait 500ms and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      console.error('❌ Timeout waiting for libdxfrw.js to load');
      setIsInitialized(false);
    };

    waitForScript();
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsConverting(true);
    setStatus('converting');
    setProgress(0);
    setErrorMessage('');

    let hasError = false;

    try {
      // Check if converter is initialized
      if (!isInitialized) {
        throw new Error('Converter not initialized. Please refresh the page.');
      }

      if (conversionMode === 'dwg-to-dxf') {
        // DWG → DXF Conversion
        const arrayBuffer = await file.arrayBuffer();

        // Check DWG version from header
        const view = new Uint8Array(arrayBuffer);
        const versionString = String.fromCharCode(...view.slice(0, 6));
        console.log(`📋 DWG File Header: "${versionString}"`);

        // Extract version code (e.g., "AC1032" -> 1032)
        if (!versionString.startsWith('AC')) {
          throw new Error('Invalid DWG file format. File does not appear to be a valid AutoCAD DWG file.');
        }

        const versionCode = versionString.substring(2, 6);
        const versionNum = parseInt(versionCode, 10);
        console.log(`📋 DWG Version Code: AC${versionCode} (${versionNum})`);

        // LibreDWG supports up to AC1032 (AutoCAD 2018)
        if (versionNum > 1032) {
          throw new Error(`DWG file version ${versionString} is not supported. Supported versions: AutoCAD R14-2018 (AC1014-AC1032). Your file appears to be from AutoCAD 2019 or newer. Please re-save as "AutoCAD 2018 DWG" format.`);
        }

        setProgress(10);

        // Dynamically import converter
        const { convertDWGtoDXF } = await import('@/lib/converter');

        setProgress(20);

        // Convert DWG to DXF
        const result = await convertDWGtoDXF(arrayBuffer, file.name);

        setProgress(90);

        if (!result.success || !result.dxfContent) {
          throw new Error(result.error || 'Conversion failed');
        }

        // Download the converted DXF file
        downloadDXF(result.dxfContent, file.name);

        setProgress(100);
        setStatus('success');

      } else {
        // DXF → DWG Conversion (via API)
        setProgress(10);

        // Create FormData to send DXF file to API
        const formData = new FormData();
        formData.append('file', file);

        setProgress(20);

        // Call CADPort API endpoint
        const response = await fetch('/api/convert-to-dwg', {
          method: 'POST',
          body: formData,
        });

        setProgress(70);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Conversion failed');
        }

        // Get DWG file as blob
        const dwgBlob = await response.blob();

        setProgress(90);

        // Download the converted DWG file
        downloadDWG(dwgBlob, file.name);

        setProgress(100);
        setStatus('success');
      }

    } catch (error) {
      hasError = true;
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setIsConverting(false);

      // Only auto-reset for success state - keep errors visible until next file drop
      if (!hasError) {
        setTimeout(() => {
          setStatus('idle');
          setProgress(0);
        }, 3000);
      }
      // Error state persists until user drops another file
    }
  }, [isInitialized, conversionMode]);

  const downloadDXF = (content: string, originalFileName: string) => {
    const dxfFileName = originalFileName.replace(/\.[^/.]+$/, '') + '.dxf';
    const blob = new Blob([content], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dxfFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadDWG = (blob: Blob, originalFileName: string) => {
    const dwgFileName = originalFileName.replace(/\.[^/.]+$/, '') + '.dwg';
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dwgFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CADPort</h1>
                <p className="text-sm text-blue-300">DWG ⇄ DXF Converter</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {conversionMode === 'dwg-to-dxf' ? 'Convert DWG Files to DXF' : 'Convert DXF Files to DWG'}
          </h2>
          <p className="text-xl text-blue-200 mb-2">
            100% Free • Secure • Private
          </p>
          <p className="text-sm text-blue-300/70">
            {conversionMode === 'dwg-to-dxf'
              ? 'All processing happens in your browser. Your files never leave your device.'
              : 'Processing happens on the server. Files are deleted immediately after conversion.'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 inline-flex">
            <button
              onClick={() => setConversionMode('dwg-to-dxf')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                conversionMode === 'dwg-to-dxf'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              DWG → DXF
            </button>
            <button
              onClick={() => setConversionMode('dxf-to-dwg')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                conversionMode === 'dxf-to-dwg'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              DXF → DWG
            </button>
          </div>
        </div>

        {/* Format Info */}
        {conversionMode === 'dxf-to-dwg' && (
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-blue-300 mb-1">
                  Output Format
                </p>
                <p className="text-sm text-blue-200/90">
                  DXF files will be converted to <strong>AutoCAD 2000 DWG format (R2000)</strong> using LibreDWG. This format is compatible with all modern CAD software.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message - Above Drop Zone */}
        {status === 'error' && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-red-300 mb-1">
                  ❌ Conversion Failed
                </p>
                <p className="text-sm text-red-200/90">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Uploader */}
        <FileUploader
          onFileSelect={handleFileSelect}
          isConverting={isConverting}
          conversionMode={conversionMode}
        />

        {/* Conversion Status */}
        {status === 'converting' || status === 'success' ? (
          <ConversionStatus
            status={status}
            progress={progress}
            errorMessage={errorMessage}
          />
        ) : null}

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">100% Private</h3>
            <p className="text-blue-200/70 text-sm">
              Files are processed entirely in your browser. No uploads, no servers, no tracking.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-blue-200/70 text-sm">
              Instant conversion with WebAssembly. No waiting for uploads or downloads.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Always Free</h3>
            <p className="text-blue-200/70 text-sm">
              No limits, no subscriptions, no hidden costs. Open source and free forever.
            </p>
          </div>
        </div>

        {/* Tech Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">How it works</h3>
          <p className="text-blue-200/70 text-sm mb-4">
            CADPort uses <span className="text-blue-300 font-medium">LibreDWG</span> compiled to WebAssembly to convert your files
            directly in your browser. This means your files never leave your device, ensuring complete privacy and security.
          </p>
          <p className="text-blue-200/70 text-sm">
            Built with modern web technologies and licensed under GPL-3.0, CADPort is free and open source software.
          </p>
        </div>

        {/* Archad Promotion */}
        <a
          href="https://archad.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 block bg-black border border-zinc-800 rounded-xl p-8 hover:border-zinc-700 transition-all group"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src="/archad-logo.png"
                  alt="Archad Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  Have you tried the new Archad design tool?
                </p>
                <p className="text-zinc-400 text-sm">
                  Design anywhere with AI-enhanced drawings and tools
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="px-6 py-2.5 bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium transition-all flex items-center gap-2">
                Try Archad
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </a>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-sm text-blue-300/70">
              © 2026 CADPort • Licensed under GPL-3.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
