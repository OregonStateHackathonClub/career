import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        // replace with your actual bucket name
        pathname: "/beaverhacks/**",
      },
    ],
  },
};

export default nextConfig;
