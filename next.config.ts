import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 关闭开发模式左下角 Next.js 英文指示器
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
