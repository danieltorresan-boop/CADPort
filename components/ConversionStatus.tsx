'use client';

interface ConversionStatusProps {
  status: 'converting' | 'success' | 'error';
  progress: number;
  errorMessage?: string;
}

export default function ConversionStatus({ status, progress, errorMessage }: ConversionStatusProps) {
  return (
    <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      {status === 'converting' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-white font-medium">Converting...</p>
              <p className="text-sm text-blue-300/70">Processing your DWG file</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-blue-300/70 text-right">{progress}%</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Conversion successful!</p>
            <p className="text-sm text-green-300/70">Your DXF file has been downloaded</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Conversion failed</p>
            <p className="text-sm text-red-300/70">{errorMessage || 'An error occurred during conversion'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
