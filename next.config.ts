import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.nps.gov',
      },
      {
        protocol: 'https',
        hostname: 'www.nps.gov',
      },
    ],
  },
};

export default nextConfig;
