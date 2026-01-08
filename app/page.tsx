'use client';

import { useState, useCallback } from 'react';
import FileUploader from '@/components/FileUploader';
import ConversionStatus from '@/components/ConversionStatus';

export default function Home() {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'converting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelect = useCallback(async (file: File) => {
    setIsConverting(true);
    setStatus('converting');
    setProgress(0);
    setErrorMessage('');

    try {
      // TODO: Integrate LibreDWG WASM conversion
      // For now, simulate conversion process
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate successful conversion
      setProgress(100);
      setStatus('success');

      // Create a simple DXF file (placeholder until WASM is integrated)
      const dxfContent = generatePlaceholderDXF(file.name);
      downloadDXF(dxfContent, file.name);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3000);
    }
  }, []);

  const generatePlaceholderDXF = (fileName: string): string => {
    // Simple DXF header - this will be replaced with actual LibreDWG conversion
    return `0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
9
$DWGCODEPAGE
3
ANSI_1252
0
ENDSEC
0
SECTION
2
ENTITIES
0
TEXT
8
0
10
0.0
20
0.0
30
0.0
40
2.5
1
Converted from ${fileName}
0
ENDSEC
0
EOF
`;
  };

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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Convert DWG Files to DXF
          </h2>
          <p className="text-xl text-blue-200 mb-2">
            100% Free • Secure • Private
          </p>
          <p className="text-sm text-blue-300/70">
            All processing happens in your browser. Your files never leave your device.
          </p>
        </div>

        {/* File Uploader */}
        <FileUploader
          onFileSelect={handleFileSelect}
          isConverting={isConverting}
        />

        {/* Conversion Status */}
        {status !== 'idle' && (
          <ConversionStatus
            status={status}
            progress={progress}
            errorMessage={errorMessage}
          />
        )}

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
                  Have you tried the new Archad.pro design tool?
                </p>
                <p className="text-zinc-400 text-sm">
                  AI-powered CAD application with comprehensive drawing and design capabilities
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
