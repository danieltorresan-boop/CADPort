// API endpoint for DXF to DWG conversion
// This allows Archad to export drawings as AutoCAD 2000 DWG files
// Uses LibreDWG command-line tools (dxf2dwg.exe)

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

// Note: Using Node.js runtime (not edge) because we need file system access
// export const runtime = 'nodejs'; // Default, can be omitted

export async function POST(request: NextRequest) {
  let tempDxfPath: string | null = null;
  let tempDwgPath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (DXF)
    if (!file.name.toLowerCase().endsWith('.dxf')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only .dxf files are supported.' },
        { status: 400 }
      );
    }

    // Read file as text (DXF is ASCII format)
    const dxfContent = await file.text();

    // Create temporary files
    const tempId = Date.now() + '-' + Math.random().toString(36).substring(7);
    tempDxfPath = path.join(tmpdir(), `${tempId}.dxf`);
    tempDwgPath = path.join(tmpdir(), `${tempId}.dwg`);

    // Write DXF content to temp file
    await writeFile(tempDxfPath, dxfContent, 'utf-8');

    // Path to dxf2dwg.exe (in CADPort root directory)
    const dxf2dwgPath = path.join(process.cwd(), 'dxf2dwg.exe');

    // Convert DXF to DWG using LibreDWG command-line tool
    // Output will be in AutoCAD 2000 format (widely compatible)
    const { stdout, stderr } = await execAsync(
      `"${dxf2dwgPath}" -o "${tempDwgPath}" "${tempDxfPath}"`
    );

    console.log('dxf2dwg stdout:', stdout);
    if (stderr) console.log('dxf2dwg stderr:', stderr);

    // Read the converted DWG file
    const dwgContent = await readFile(tempDwgPath);

    // Clean up temp files
    await unlink(tempDxfPath);
    await unlink(tempDwgPath);
    tempDxfPath = null;
    tempDwgPath = null;

    // Return DWG file as binary response
    return new NextResponse(dwgContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/acad',
        'Content-Disposition': `attachment; filename="${file.name.replace('.dxf', '.dwg')}"`,
      },
    });

  } catch (error) {
    console.error('API conversion error:', error);

    // Clean up temp files on error
    try {
      if (tempDxfPath) await unlink(tempDxfPath);
      if (tempDwgPath) await unlink(tempDwgPath);
    } catch {}

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
    service: 'CADPort DXF to DWG Converter',
    version: '1.0',
    method: 'LibreDWG command-line (dxf2dwg)',
    outputFormat: 'AutoCAD 2000 DWG (R2000)',
    compatibility: 'Works with all modern CAD software',
    timestamp: new Date().toISOString()
  });
}
