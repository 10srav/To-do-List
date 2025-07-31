/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in development to avoid file permission issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
}

module.exports = nextConfig 