import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // I18n
    i18n: {
        locales: ["en", "vn"],
        defaultLocale: "en",
    },
    images: {
        remotePatterns: [
            {
                // Lấy ảnh từ server
                hostname: process.env.NEXT_PUBLIC_SERVER_HOSTNAME || "localhost",
            },
            {
                protocol: "https",
                hostname: "**.steamstatic.com", // Tất cả subdomain
            },
            {
                protocol: "https",
                hostname: "placehold.co", // Tất cả subdomain
            },
        ]
    },
    reactStrictMode: false,
};

export default nextConfig;
