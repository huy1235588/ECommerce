import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // I18n
    i18n: {
        locales: ["en", "fr"],
        defaultLocale: "en",
    },
};

export default nextConfig;
