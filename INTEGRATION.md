# CADPort Integration Guide for Archad

This guide explains how to integrate CADPort's DWG conversion into Archad.

## Overview

CADPort provides a conversion API that can be loaded in an iframe. Communication happens via `postMessage` API, keeping both applications legally separate while providing seamless UX.

## Integration Steps for Archad

### Step 1: Create Hidden iframe

In Archad's code, create a hidden iframe that loads the CADPort API:

```typescript
// In Archad's main component or App.tsx
import { useEffect, useState, useRef } from 'react';

// Create iframe (do this once when app loads)
const [isConverterReady, setIsConverterReady] = useState(false);
const iframeRef = useRef<HTMLIFrameElement>(null);

useEffect(() => {
  // Create hidden iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://cad-port.vercel.app/api'; // CADPort API endpoint
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  iframeRef.current = iframe;

  // Listen for ready message
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'CADPORT_READY' && event.data.source === 'cadport') {
      setIsConverterReady(true);
      console.log('✅ CADPort converter ready');
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
    iframe.remove();
  };
}, []);
```

### Step 2: Create Conversion Helper Function

```typescript
// Create a conversion helper
async function convertDWGtoDXF(dwgFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Read file as ArrayBuffer
    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileData = e.target?.result as ArrayBuffer;

      // Listen for conversion result
      const handleConversionResult = (event: MessageEvent) => {
        if (event.data.source !== 'cadport') return;

        if (event.data.type === 'CONVERSION_SUCCESS') {
          window.removeEventListener('message', handleConversionResult);
          resolve(event.data.data.dxfContent);
        }

        if (event.data.type === 'CONVERSION_ERROR') {
          window.removeEventListener('message', handleConversionResult);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', handleConversionResult);

      // Send conversion request to iframe
      iframeRef.current?.contentWindow?.postMessage({
        type: 'CONVERT_DWG_TO_DXF',
        data: {
          fileData: fileData,
          fileName: dwgFile.name
        }
      }, 'https://cad-port.vercel.app');
    };

    reader.readAsArrayBuffer(dwgFile);
  });
}
```

### Step 3: Use in File Import

```typescript
// In your file import handler (CAD.tsx)
const handleFileImport = async (file: File) => {
  const fileName = file.name.toLowerCase();

  // Check if it's a DWG file
  if (fileName.endsWith('.dwg')) {
    try {
      // Show loading state
      console.log('Converting DWG to DXF...');

      // Convert using CADPort
      const dxfContent = await convertDWGtoDXF(file);

      // Now import the DXF using existing import logic
      await importDXFContent(dxfContent, file.name);

      console.log('✅ DWG imported successfully');
    } catch (error) {
      console.error('Failed to import DWG:', error);
      alert('Failed to convert DWG file: ' + error.message);
    }
  } else if (fileName.endsWith('.dxf')) {
    // Use existing DXF import
    await importDXFFile(file);
  }
};
```

### Step 4: Test the Integration

1. Upload a DWG file in Archad
2. File should automatically convert to DXF via CADPort iframe
3. DXF content should import into Archad canvas

## Message Protocol

### From Archad to CADPort

**Convert DWG to DXF:**
```typescript
{
  type: 'CONVERT_DWG_TO_DXF',
  data: {
    fileData: ArrayBuffer,  // DWG file data
    fileName: string        // Original filename
  }
}
```

### From CADPort to Archad

**Ready:**
```typescript
{
  type: 'CADPORT_READY',
  source: 'cadport'
}
```

**Conversion Success:**
```typescript
{
  type: 'CONVERSION_SUCCESS',
  data: {
    dxfContent: string,  // DXF file content
    fileName: string     // Suggested filename
  },
  source: 'cadport'
}
```

**Conversion Error:**
```typescript
{
  type: 'CONVERSION_ERROR',
  error: string,
  source: 'cadport'
}
```

## Security

- CADPort API checks origin before processing messages
- Allowed origins: localhost (dev), archad.pro (production)
- All processing happens client-side
- No data sent to servers

## Supported Formats

- **Input**: DWG files (AutoCAD R14 to AutoCAD 2020)
- **Output**: DXF files (AutoCAD 2007 format for maximum compatibility)

## Troubleshooting

### Converter not ready
- Check browser console for errors
- Ensure CADPort iframe loaded successfully
- Wait for `CADPORT_READY` message before sending conversion requests

### Conversion fails
- Check DWG file version (must be R14-2020)
- Check file integrity
- Look for error message in `CONVERSION_ERROR` response

### Origin errors
- Update allowed origins in CADPort's `app/api/page.tsx` if needed
- For local development, use localhost:8081

## Legal Compliance

This integration method maintains legal separation:
- ✅ Two separate applications
- ✅ Two separate domains
- ✅ Communication via standard web APIs
- ✅ CADPort remains GPL-3.0
- ✅ Archad remains proprietary

No GPL code is imported into Archad's codebase.
