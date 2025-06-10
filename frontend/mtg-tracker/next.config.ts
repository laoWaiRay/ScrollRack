import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      }
    }
  },
  images: {
    domains: [
      "cards.scryfall.io"
    ],
  },
};

export default nextConfig;
