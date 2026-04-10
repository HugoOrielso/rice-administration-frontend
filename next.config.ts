import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "production"
          ? "https://backend.arrozandinagroup.com/api/:path*"
          : "http://localhost:4000/api/:path*", // ← tu puerto de Express local
      },
    ];
  },
  generateBuildId: async () => {
    return process.env.BUILD_ID || crypto.randomUUID()
  },
};

export default nextConfig;

