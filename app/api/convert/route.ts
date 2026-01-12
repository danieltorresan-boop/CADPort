// API endpoint for DWG to DXF conversion
// This allows Archad to call CADPort as a microservice

import { NextRequest, NextResponse } from 'next/server';
import { convertDWGtoDXF } from '@/lib/converter';

// Note: Using Node.js runtime (not edge) because WebAssembly works better here
// export const runtime = 'nodejs'; // Default, can be omitted

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.dwg')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only .dwg files are supported.' },
        { status: 400 }
      );
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert DWG to DXF
    const result = await convertDWGtoDXF(arrayBuffer, file.name);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Conversion failed'
        },
        { status: 400 }
      );
    }

    // Return successful conversion
    return NextResponse.json({
      success: true,
      dxf: result.dxfContent,
      metadata: {
        originalFileName: file.name,
        fileSize: arrayBuffer.byteLength,
        convertedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API conversion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'CADPort DWG Converter',
    version: '1.0',
    supported: 'AutoCAD R14-2018 (AC1014-AC1032)',
    timestamp: new Date().toISOString()
  });
}
