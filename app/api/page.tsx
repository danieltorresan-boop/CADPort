'use client';

import { useEffect, useState } from 'react';

/**
 * Hidden API page for Archad integration
 * This page is loaded in an iframe and communicates via postMessage
 */
export default function ConverterAPI() {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('Initializing converter...');

  useEffect(() => {
    // Wait for libdxfrw.js to load, then initialize
    const waitForScript = async () => {
      let attempts = 0;
      const maxAttempts = 20; // Wait up to 10 seconds

      while (attempts < maxAttempts) {
        // Check if createModule is available
        if (typeof window !== 'undefined' && (window as any).createModule) {
          console.log('✅ libdxfrw.js loaded, initializing API...');

          // Dynamically import converter to avoid SSR issues
          const { initializeConverter } = await import('@/lib/converter');
          const success = await initializeConverter();

          if (success) {
            setIsReady(true);
            setStatus('Ready to convert');

            // Notify parent window that converter is ready
            window.parent.postMessage({
              type: 'CADPORT_READY',
              source: 'cadport'
            }, '*');

            console.log('✅ CADPort API ready for integration');
          } else {
            setStatus('Failed to initialize converter');
            window.parent.postMessage({
              type: 'CADPORT_ERROR',
              error: 'Failed to initialize converter',
              source: 'cadport'
            }, '*');
          }
          return;
        }

        // Wait 500ms and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      // Timeout
      setStatus('Failed to load converter');
      window.parent.postMessage({
        type: 'CADPORT_ERROR',
        error: 'Timeout loading libdxfrw.js',
        source: 'cadport'
      }, '*');
    };

    waitForScript();

    // Listen for conversion requests from parent window (Archad)
    const handleMessage = async (event: MessageEvent) => {
      // Security check - only accept messages from allowed origins
      // In production, you should whitelist specific origins
      const allowedOrigins = [
        'http://localhost:8081',
        'https://archad.pro',
        'https://www.archad.pro'
      ];

      // For development, we'll allow localhost
      if (!event.origin.includes('localhost') && !allowedOrigins.includes(event.origin)) {
        console.warn('Rejected message from unauthorized origin:', event.origin);
        return;
      }

      const { type, data } = event.data;

      if (type === 'CONVERT_DWG_TO_DXF') {
        console.log('📥 Received conversion request from Archad');
        setStatus('Converting...');

        try {
          // Extract file data
          const { fileData, fileName } = data;

          if (!fileData || !fileName) {
            throw new Error('Missing file data or filename');
          }

          // Convert ArrayBuffer if needed
          const arrayBuffer = fileData instanceof ArrayBuffer
            ? fileData
            : new Uint8Array(fileData).buffer;

          // Dynamically import converter to avoid SSR issues
          const { convertDWGtoDXF } = await import('@/lib/converter');

          // Perform conversion
          const result = await convertDWGtoDXF(arrayBuffer, fileName);

          if (result.success && result.dxfContent) {
            // Send DXF data back to parent window
            window.parent.postMessage({
              type: 'CONVERSION_SUCCESS',
              data: {
                dxfContent: result.dxfContent,
                fileName: fileName.replace(/\.dwg$/i, '.dxf')
              },
              source: 'cadport'
            }, event.origin);

            setStatus('Conversion successful');
            console.log('✅ Conversion successful, sent DXF to Archad');
          } else {
            throw new Error(result.error || 'Conversion failed');
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';

          // Send error back to parent window
          window.parent.postMessage({
            type: 'CONVERSION_ERROR',
            error: errorMessage,
            source: 'cadport'
          }, event.origin);

          setStatus(`Error: ${errorMessage}`);
          console.error('❌ Conversion error:', errorMessage);
        }
      }

      // Handle DXF to DWG conversion (future feature)
      if (type === 'CONVERT_DXF_TO_DWG') {
        window.parent.postMessage({
          type: 'CONVERSION_ERROR',
          error: 'DXF to DWG conversion is not yet implemented',
          source: 'cadport'
        }, event.origin);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">
          CADPort Converter API
        </h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          {!isReady && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          {isReady && (
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          )}
          <p className="text-sm text-zinc-400">{status}</p>
        </div>

        <p className="text-xs text-zinc-500">
          This page is used for Archad integration.
          <br />
          Do not close this window.
        </p>
      </div>
    </div>
  );
}
