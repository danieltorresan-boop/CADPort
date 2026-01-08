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
    // Create database and file handler
    const database = new libdxfrwModule.DRW_Database();
    const fileHandler = new libdxfrwModule.DRW_FileHandler();
    fileHandler.database = database;

    // Import DWG file
    const importSuccess = fileHandler.fileImport(dwgFileContent, database, false, false);

    if (!importSuccess) {
      database.delete();
      fileHandler.delete();
      return {
        success: false,
        error: `Failed to parse ${fileName}. The file may be corrupted or in an unsupported format.`
      };
    }

    // Export as DXF (AC1021 = AutoCAD 2007 DXF format - widely compatible)
    const dxfContent = fileHandler.fileExport(
      libdxfrwModule.DRW_Version.AC1021,
      false, // binary = false (ASCII DXF)
      database,
      false
    );

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
    console.error('Error during DWG to DXF conversion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown conversion error'
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
