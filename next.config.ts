import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "production"
          ? "http://srv-captain--backend/:path*"  // ✅ sin puerto en CapRover
          : "http://localhost:4000/:path*",
      },
    ];
  }
};

export default nextConfig;

