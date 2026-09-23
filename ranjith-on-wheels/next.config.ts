import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only allows quality values declared here — without this, a
    // component's `quality` prop is silently clamped to the default (75).
    // 68 is the hero photo's own, lower-weight choice (CLAUDE.md §11's
    // image budget); 75 stays as everything else's default.
    qualities: [68, 75],
  },
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
