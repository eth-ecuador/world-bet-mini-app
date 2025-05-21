import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "static.usernames.app-backend.toolsforhumanity.com",
      "r2.thesportsdb.com",
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
