import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "production"
          ? "http://srv-captain--backend:4000/:path*"  // ✅ con puerto 4000
          : "http://localhost:4000/:path*",
      },
    ];
  },
};

export default nextConfig;

