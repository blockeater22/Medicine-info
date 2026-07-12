import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/disclaimer", destination: "/medical-disclaimer", permanent: true },
      { source: "/medical-team", destination: "/editorial-policy", permanent: true },
      { source: "/medical-team/:path*", destination: "/editorial-policy", permanent: true },
    ];
  },
};

export default nextConfig;
