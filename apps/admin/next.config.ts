import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  serverExternalPackages: ["@repo/db", "@prisma/client", "prisma"],
};

export default nextConfig;
