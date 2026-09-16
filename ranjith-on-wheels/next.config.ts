import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/donate",
        destination: "/support",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
