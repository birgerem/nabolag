import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignorer ESLint under build — vi lint-er lokalt i stedet
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer TypeScript-feil under build for nå
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
