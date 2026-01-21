import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Workers
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
