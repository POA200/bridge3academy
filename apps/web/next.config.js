/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/ui"],
	serverExternalPackages: ["@repo/db", "@prisma/client", "prisma"],
};

export default nextConfig;
