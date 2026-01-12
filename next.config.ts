import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: API routes require server runtime, not static export
  // output: 'export', // Commented out to enable API routes
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude WebAssembly files from server-side bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@mlightcad/libdxfrw-web': 'commonjs @mlightcad/libdxfrw-web'
      });
    }

    // Support for WASM files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
