// Global type declarations

interface Window {
  createModule: () => Promise<any>;
}

declare global {
  var createModule: () => Promise<any>;
}

export {};
