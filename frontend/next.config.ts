import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            'images.unsplash.com',
            'www.gravatar.com',
            'lh3.googleusercontent.com',
            'res.cloudinary.com',
            'localhost',
        ],
    },
};

export default nextConfig;
