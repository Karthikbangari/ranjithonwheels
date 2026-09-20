import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/donate",
        destination: "/support",
        permanent: true,
      },
      // The ten "top story" pages became the cinematic chapters (CLAUDE.md §0
      // decision #20): the same countries, now at /journey/[country].
      {
        source: "/stories/:slug",
        destination: "/journey/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
