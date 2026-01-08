import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for Vercel
  images: {
    unoptimized: true, // Required for static export
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
