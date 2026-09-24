import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@okurmen/database'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
};

export default nextConfig;
