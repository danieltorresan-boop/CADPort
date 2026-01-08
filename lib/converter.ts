// DWG to DXF Conversion Service using libdxfrw-web
// This file handles the actual conversion using WebAssembly

export interface ConversionResult {
  success: boolean;
  dxfContent?: string;
  error?: string;
}

let libdxfrwModule: any = null;

/**
 * Initialize the libdxfrw WebAssembly module
 * This should be called once when the app loads
 */
export async function initializeConverter(): Promise<boolean> {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.warn('initializeConverter called on server side, skipping');
    return false;
  }

  if (libdxfrwModule) {
    return true; // Already initialized
  }

  try {
    // @ts-ignore - createModule is loaded from libdxfrw.js
    if (typeof window.createModule === 'undefined') {
      console.error('createModule is not defined. Make sure libdxfrw.js is loaded.');
      return false;
    }

    // @ts-ignore
    libdxfrwModule = await window.createModule();
    console.log('✅ LibreDWG WASM module initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize libdxfrw module:', error);
    return false;
  }
}

/**
 * Convert DWG file to DXF format
 * @param dwgFileContent - ArrayBuffer containing the DWG file data
 * @param fileName - Original file name (for error messages)
 * @returns ConversionResult with DXF content or error
 */
/**
 * Check DWG version from file header
 * DWG files start with version string like "AC1024" (2010), "AC1027" (2013), "AC1032" (2018), etc.
 */
function checkDWGVersion(arrayBuffer: ArrayBuffer): { supported: boolean; version: string } {
  const view = new Uint8Array(arrayBuffer);
  const versionString = String.fromCharCode(...view.slice(0, 6));

  // AC1014 = R14, AC1015 = 2000, AC1018 = 2004, AC1021 = 2007,
  // AC1024 = 2010, AC1027 = 2013, AC1032 = 2018
  // AC1033+ = 2019+ (NOT SUPPORTED)
  const versionCode = versionString.substring(2, 6);
  const versionNum = parseInt(versionCode, 10);

  // LibreDWG supports up to AC1032 (AutoCAD 2018)
  const supported = versionNum <= 1032;

  return { supported, version: versionString };
}

export async function convertDWGtoDXF(
  dwgFileContent: ArrayBuffer,
  fileName: string
): Promise<ConversionResult> {
  // Ensure module is initialized
  if (!libdxfrwModule) {
    const initialized = await initializeConverter();
    if (!initialized) {
      return {
        success: false,
        error: 'Failed to initialize conversion module'
      };
    }
  }

  try {
    console.log(`📥 Converting ${fileName} (${dwgFileContent.byteLength} bytes)`);

    // Check DWG version BEFORE attempting conversion to avoid browser freeze
    const versionCheck = checkDWGVersion(dwgFileContent);
    console.log(`📋 DWG Version: ${versionCheck.version} (Supported: ${versionCheck.supported})`);

    if (!versionCheck.supported) {
      return {
        success: false,
        error: `DWG file version ${versionCheck.version} not supported. Supported versions: AutoCAD R14-2018 (AC1014-AC1032). Your file appears to be from AutoCAD 2019 or newer. Please re-save as "AutoCAD 2018 DWG" format.`
      };
    }

    // Create database and file handler
    const database = new libdxfrwModule.DRW_Database();
    const fileHandler = new libdxfrwModule.DRW_FileHandler();
    fileHandler.database = database;

    console.log('📦 Created database and file handler');

    // Import DWG file using DRW_DwgR class (correct API for DWG files)
    console.log('📖 Attempting to read DWG file...');
    const dwgReader = new libdxfrwModule.DRW_DwgR(dwgFileContent);

    // Enable debug mode to see what's happening
    try {
      if (libdxfrwModule.DRW_Dbg_Level && libdxfrwModule.DRW_Dbg_Level.Debug) {
        dwgReader.setDebug(libdxfrwModule.DRW_Dbg_Level.Debug);
        console.log('🐛 Debug mode enabled');
      }
    } catch (e) {
      console.log('ℹ️ Debug mode not available');
    }

    let readResult;
    try {
      console.log('⏳ Starting DWG read operation...');
      console.time('DWG Read Duration');

      // Suppress console.error during WASM read (LibreDWG outputs debug info to stderr)
      const originalConsoleError = console.error;
      console.error = () => {}; // Temporarily disable console.error

      readResult = dwgReader.read(fileHandler, false);

      console.error = originalConsoleError; // Restore console.error

      console.timeEnd('DWG Read Duration');
      console.log('✅ Read operation completed. Result:', readResult);

      // Log database stats
      try {
        if (database.mBlock && database.mBlock.entities) {
          console.log(`📊 Entities found: ${database.mBlock.entities.size()}`);
        }
        if (database.layers) {
          console.log(`📊 Layers found: ${database.layers.size()}`);
        }
      } catch (e) {
        console.log('ℹ️ Could not log database stats');
      }

    } catch (readError) {
      console.error('❌ Error during DWG read operation:', readError);
      console.timeEnd('DWG Read Duration');

      dwgReader.delete();
      database.delete();
      fileHandler.delete();

      // Provide more specific error message
      const errorMsg = typeof readError === 'number'
        ? `DWG file version not supported (error code: ${readError}). Supported versions: AutoCAD R14-2018. Your file may be from AutoCAD 2019 or newer.`
        : `Failed to read DWG file: ${readError}`;

      return {
        success: false,
        error: errorMsg
      };
    }

    // Clean up DWG reader
    dwgReader.delete();

    // Check if read failed (non-zero return code means error in LibreDWG)
    if (readResult !== 0) {
      database.delete();
      fileHandler.delete();
      return {
        success: false,
        error: `DWG file version not supported (error code: ${readResult}). Supported versions: AutoCAD R14-2018. Your file may be from AutoCAD 2019 or newer.`
      };
    }

    console.log('✅ DWG file read successfully');

    // Export as DXF (AC1021 = AutoCAD 2007 DXF format - widely compatible)
    console.log('📝 Exporting to DXF format...');
    const dxfContent = fileHandler.fileExport(
      libdxfrwModule.DRW_Version.AC1021,
      false, // binary = false (ASCII DXF)
      database,
      false
    );

    console.log('DXF export result:', dxfContent ? `${dxfContent.length} bytes` : 'null/empty');

    // Clean up C++ objects
    database.delete();
    fileHandler.delete();

    if (!dxfContent || dxfContent.length === 0) {
      return {
        success: false,
        error: 'Conversion produced empty DXF file'
      };
    }

    console.log(`✅ Successfully converted ${fileName} to DXF (${dxfContent.length} bytes)`);

    return {
      success: true,
      dxfContent
    };

  } catch (error) {
    console.error('❌ Error during DWG to DXF conversion:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    // Try to get more details from the error
    let errorMessage = 'Unknown conversion error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'number') {
      errorMessage = `LibreDWG error code: ${error} (possible file format or version incompatibility)`;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Convert DXF file to DWG format (future enhancement)
 * @param dxfFileContent - String containing the DXF file data
 * @param fileName - Original file name
 * @returns ConversionResult with DWG content or error
 */
export async function convertDXFtoDWG(
  dxfFileContent: string,
  fileName: string
): Promise<ConversionResult> {
  // TODO: Implement DXF to DWG conversion
  // This is more complex and may require additional libraries
  return {
    success: false,
    error: 'DXF to DWG conversion is not yet implemented'
  };
}
