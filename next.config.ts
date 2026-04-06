import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "production"
          ? "http://srv-captain--backend:4000/:path*"  // ✅ red interna de CapRover
          : "http://localhost:4000/:path*",             // ✅ desarrollo local
      },
    ];
  },
};

export default nextConfig;

