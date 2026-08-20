import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const devOrigins = [
  "https://remedies-replacing-chubby-adjust.trycloudflare.com",
  "https://sending-packed-distributor-mag.trycloudflare.com",
  "https://gibson-punk-para-soldier.trycloudflare.com",
  "https://measuring-efficient-jeff-desktops.trycloudflare.com",
  "*.trycloudflare.com",
  "*.loca.lt",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
  experimental: {
    serverActions: {
      allowedOrigins: devOrigins,
      bodySizeLimit: "64mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
