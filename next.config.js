/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in development to avoid file permission issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
  // Skip unnecessary files during build
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
}

module.exports = nextConfig 