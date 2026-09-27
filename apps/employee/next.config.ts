import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@okurmen/database'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
