import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Module-7-Final-Project",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
