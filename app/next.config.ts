import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: [
    "*",
    "https://8ddd-200-85-80-26.ngrok-free.app",
    "http://8ddd-200-85-80-26.ngrok-free.app",
    "8ddd-200-85-80-26.ngrok-free.app",
  ], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
