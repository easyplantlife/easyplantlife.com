import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Image optimization configuration
   *
   * Enables Next.js image optimization for external images from Medium.
   * This allows the Image component to optimize blog post thumbnails.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
