import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: NextConfig) => {
    config.module.rules.push({
      test: /\.ftl$/,
      type: "asset/source", // Treat `.ftl` files as source assets
    });
    return config;
  },
};

export default nextConfig;
