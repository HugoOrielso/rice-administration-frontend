import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
    async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend.arrozandinagroup.com/api/:path*",
      },
    ];
  }
};

export default nextConfig;

